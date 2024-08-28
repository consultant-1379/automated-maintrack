const expect = require('expect');
const nock = require('nock');

const { triggerUpgradeParallelSlot } = require('../../use-cases');
const { dbOperator } = require('../../../data-access');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

const emtUrl = process.env.EMT_URL;

let initialSlotId;

const physicalEnvironmentEmtUrl = '/api/deployments/search?q=state=IDLE&q=testPhase=MTE&q=platformType=physical&q=systemHealthCheckStatus=COMPLETED';

const cloudEnvironmentEmtUrl = '/api/deployments/search?q=state=IDLE&q=testPhase=MTE&q=platformType=vENM&q=systemHealthCheckStatus=COMPLETED';

const physicalEnvironment = [{
  name: '297',
  testPhase: 'MTE',
  platformType: 'physical',
  productSet: '20.8.1',
}];

const cloudEnvironment = [{
  name: 'ieatenmc3b10',
  testPhase: 'MTE',
  platformType: 'vENM',
  productSet: '20.8.1',
}];

async function setupDependencies() {
  await dbOperator.dropCollection('slots');
  await dbOperator.dropCollection('failureTrackers');
  const initialSlotInserted = makeFakeSlot({ productSetVersion: 'pending', slotStatus: 'ongoing', slotNumber: 'first' });
  const initialSlot = await dbOperator.insert(initialSlotInserted, 'slots');
  initialSlotId = initialSlot.id;
  const switchboards = await dbOperator.findAll('switchboards');
  const switchboardId = switchboards[0].id;
  await dbOperator.update({
    id: switchboardId,
    numberOfDeliveryGroups: 1,
    bugsAndTRsOnlyStatus: 'off',
    slotUgFailureBehaviour: 'obsolete',
  }, 'switchboards');
}

describe('Integration Test: Trigger upgrade parallel slot', () => {
  before(async () => {
    await setupDependencies();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  it('should throw an error since there is one slot ongoing with a pending product set version', (done) => {
    let errorMessage;
    triggerUpgradeParallelSlot().catch(async (error) => {
      errorMessage = error.message;
    })
      .then(async () => {
        expect(errorMessage).toBe('There is a slot currently pending product set creation, therefore cannot kick off slot.');
        await dbOperator.update({
          id: initialSlotId,
          productSetVersion: '20.8.12',
        }, 'slots');
      })
      .then(done, done);
  });
  it('should throw an error because there are no cloud environments in EMT', (done) => {
    let errorMessage;
    let failureTracker;
    nock(emtUrl).get(physicalEnvironmentEmtUrl).reply(200, physicalEnvironment);
    nock(emtUrl).get(cloudEnvironmentEmtUrl).reply(200, []);
    triggerUpgradeParallelSlot().catch(async (error) => {
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
    triggerUpgradeParallelSlot().catch(async (error) => {
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
  it('should trigger a new slot in parallel', async () => {
    nock(emtUrl).get(physicalEnvironmentEmtUrl).reply(200, physicalEnvironment);
    nock(emtUrl).get(cloudEnvironmentEmtUrl).reply(200, cloudEnvironment);
    await triggerUpgradeParallelSlot();
    const allSlots = await dbOperator.findAll('slots');
    expect(allSlots.length).toBe(2);
    expect(allSlots[1].slotStatus).toBe('ongoing');
    expect(allSlots[1].physicalStatus).toBe('ongoing');
    expect(allSlots[1].cloudStatus).toBe('ongoing');
    expect(allSlots[1].productSetVersion).toBe('pending');
    expect(allSlots[1].physicalEnvironment).toBe('297');
    expect(allSlots[1].cloudEnvironment).toBe('ieatenmc3b10');
    expect(allSlots[1].deliveredDGs.length).toBeGreaterThanOrEqual(1);
    expect(allSlots[1].slotType).toBe('automatic');
    expect(allSlots[1].bugsAndTRsOnlyStatus).toBe('off');
    expect(allSlots[1].slotUgFailureBehaviour).toBe('obsolete');
    expect(allSlots[1].deliveredDGs[0].createdByTeam).toBeTruthy();
    expect(allSlots[1].deliveredDGs[0].deliveryGroupId).toBeTruthy();
    expect(allSlots[1].deliveredDGs[0].includedCategories).toBeTruthy();
    expect(allSlots[1].deliveredDGs[0].typeOfDelivery).toEqual('auto');
    expect(allSlots[1].slotNumber).toEqual('second');
  });
  it('should throw an error because there are two slots ongoing', (done) => {
    let errorMessage;
    triggerUpgradeParallelSlot().catch(async (error) => {
      errorMessage = error.message;
    }).then(async () => {
      expect(errorMessage).toBe('There is 2 slots ongoing, therefore cannot kick off slot');
    })
      .then(done, done);
  });

  after(async () => {
    await dbOperator.dropCollection('failureTrackers');
    await dbOperator.dropCollection('slots');
    const switchboards = await dbOperator.findAll('switchboards');
    const switchboardId = switchboards[0].id;
    await dbOperator.update({
      id: switchboardId,
      amtTriggerStatus: 'off',
      e2eSlotCompletionDGObsoletionBehaviour: 'off',
      upgradeSlotMechanismStatus: 'sequential',
      numberOfDeliveryGroups: 1,
    }, 'switchboards');
  });
});
