const expect = require('expect');
const nock = require('nock');

const { triggerUpgradeSequentialSlot } = require('../../use-cases');
const { dbOperator } = require('../../../data-access');

const emtUrl = process.env.EMT_URL;

const physicalEnvironmentEmtUrl = '/api/deployments/search?q=state=IDLE&q=testPhase=MTE&q=platformType=physical&q=systemHealthCheckStatus=COMPLETED';

const cloudEnvironmentEmtUrl = '/api/deployments/search?q=state=IDLE&q=testPhase=MTE&q=platformType=vENM&q=systemHealthCheckStatus=COMPLETED';

const physicalEnvironment = [{
  name: '339',
  testPhase: 'MTE',
  platformType: 'physical',
  productSet: '20.8.1',
}];

const cloudEnvironment = [{
  name: 'ieatenmc7a12',
  testPhase: 'MTE',
  platformType: 'vENM',
  productSet: '20.8.1',
}];

async function setupDependencies() {
  await dbOperator.dropCollection('slots');
  await dbOperator.dropCollection('failureTrackers');
  const switchboards = await dbOperator.findAll('switchboards');
  const switchboardId = switchboards[0].id;
  await dbOperator.update({
    id: switchboardId,
    amtTriggerStatus: 'off',
    e2eSlotCompletionDGObsoletionBehaviour: 'off',
    upgradeSlotMechanismStatus: 'sequential',
    numberOfDeliveryGroups: 2,
    bugsAndTRsOnlyStatus: 'off',
    slotUgFailureBehaviour: 'obsolete',
    lastModifiedBySignum: 'eaaaaa',
  }, 'switchboards');
}

describe('Integration Test: Trigger upgrade sequential slot', () => {
  before(async () => {
    await setupDependencies();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  it('should throw an error because there are no cloud environments in EMT', (done) => {
    let errorMessage;
    let failureTracker;
    nock(emtUrl).get(physicalEnvironmentEmtUrl).reply(200, physicalEnvironment);
    nock(emtUrl).get(cloudEnvironmentEmtUrl).reply(200, []);
    triggerUpgradeSequentialSlot().catch(async (error) => {
      errorMessage = error.message;
    })
      .then(async () => {
        failureTracker = await dbOperator.findAll('failureTrackers');
        expect(errorMessage).toBe('There are no cloud IDLE MTE test environments that are SHC completed in EMT at this time.');
        expect(failureTracker[0].failureCount).toBe(1);
        expect(failureTracker[0].reasonsForFailure[0]).toBe('Attempt 1: There are no cloud IDLE MTE test environments that are SHC completed in EMT at this time.');
      })
      .then(done, done);
  });
  it('should throw an error because there are no physical environments in EMT', (done) => {
    let errorMessage;
    let failureTracker;
    nock(emtUrl).get(cloudEnvironmentEmtUrl).reply(200, cloudEnvironment);
    nock(emtUrl).get(physicalEnvironmentEmtUrl).reply(200, []);
    triggerUpgradeSequentialSlot().catch(async (error) => {
      errorMessage = error.message;
    })
      .then(async () => {
        failureTracker = await dbOperator.findAll('failureTrackers');
        expect(errorMessage).toBe('There are no physical IDLE MTE test environments that are SHC completed in EMT at this time. ');
        expect(failureTracker[0].failureCount).toBe(2);
        expect(failureTracker[0].reasonsForFailure[1]).toBe('Attempt 2: There are no physical IDLE MTE test environments that are SHC completed in EMT at this time. ');
      })
      .then(done, done);
  });
  it('should trigger a new slot', async () => {
    nock(emtUrl).get(physicalEnvironmentEmtUrl).reply(200, physicalEnvironment);
    nock(emtUrl).get(cloudEnvironmentEmtUrl).reply(200, cloudEnvironment);
    await triggerUpgradeSequentialSlot();
    const allSlots = await dbOperator.findAll('slots');
    expect(allSlots.length).toBe(1);
    expect(allSlots[0].slotStatus).toBe('ongoing');
    expect(allSlots[0].physicalStatus).toBe('ongoing');
    expect(allSlots[0].cloudStatus).toBe('ongoing');
    expect(allSlots[0].productSetVersion).toBe('pending');
    expect(allSlots[0].physicalEnvironment).toBe('339');
    expect(allSlots[0].cloudEnvironment).toBe('ieatenmc7a12');
    expect(allSlots[0].deliveredDGs.length).toBeGreaterThanOrEqual(1);
    expect(allSlots[0].deliveredDGs.length).toBeLessThan(3);
    expect(allSlots[0].slotType).toBe('automatic');
    expect(allSlots[0].bugsAndTRsOnlyStatus).toBe('off');
    expect(allSlots[0].slotUgFailureBehaviour).toBe('obsolete');
    expect(allSlots[0].slotNumber).toEqual('first');
    allSlots[0].deliveredDGs.forEach((deliveryGroup) => {
      expect(deliveryGroup.createdByTeam).toBeTruthy();
      expect(deliveryGroup.deliveryGroupId).toBeTruthy();
      expect(deliveryGroup.includedCategories).toBeTruthy();
      expect(deliveryGroup.typeOfDelivery).toEqual('auto');
    });
  });
  it('should throw an error because there is one slot ongoing', (done) => {
    let errorMessage;
    triggerUpgradeSequentialSlot().catch(async (error) => {
      errorMessage = error.message;
    })
      .then(async () => {
        expect(errorMessage).toBe('There is 1 slots ongoing, therefore cannot kick off slot');
      })
      .then(done, done);
  });
  after(async () => {
    await dbOperator.dropCollection('slots');
    await dbOperator.dropCollection('failureTrackers');
  });
});
