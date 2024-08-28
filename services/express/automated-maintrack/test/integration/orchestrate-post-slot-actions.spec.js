const expect = require('expect');
const sinon = require('sinon');

const { orchestratePostSlotActionsFunction } = require('../../use-cases');
const { makeOrchestratePostSlotActions } = require('../../use-cases/orchestrate-post-slot-actions');
const { slotService } = require('../../../slot/use-cases');
const { switchboardService } = require('../../../switchboard/use-cases');
const deliveryGroupServiceFunctions = require('../../../delivery-group/use-cases');
const { timePeriodsService } = require('../../../time-period/use-cases');
const { orchestratePostSlotActionsHelper } = require('./../../use-cases/orchestrate-post-slot-actions-helper');
const { dbOperator } = require('../../../data-access');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

const GERRIT_AMT = process.env.GERRIT_AUTOMATED_MAINTRACK;

let switchboardId;
let obsoleteDeliveryGroupsMock;

function mockOrchestratePostSlotActionsFailureScenario(slot) {
  const mockedResponse = {
    obsoletedDeliveryGroups: [],
    deliveryGroupsFailedToObsolete: [],
  };
  for (const deliveryGroup of slot.deliveredDGs) {
    mockedResponse.deliveryGroupsFailedToObsolete.push({
      deliveryGroupId: deliveryGroup.deliveryGroupId,
      statusCode: 500,
      response: `Delivery Group ${deliveryGroup.deliveryGroupId} failed to obsolete`,
    });
  }
  obsoleteDeliveryGroupsMock = sinon
    .stub(deliveryGroupServiceFunctions, 'obsoleteDeliveryGroups')
    .returns(mockedResponse);
  return makeOrchestratePostSlotActions(
    slotService,
    switchboardService,
    orchestratePostSlotActionsHelper,
  );
}

function mockOrchestratePostSlotActionsWithoutPredictions() {
  return makeOrchestratePostSlotActions(
    slotService,
    switchboardService,
    orchestratePostSlotActionsHelper,
  );
}

async function addTestSlotToDatabase() {
  return dbOperator.insert(makeFakeSlot({
    slotStatus: 'ongoing',
    physicalStatus: 'ongoing',
    cloudStatus: 'ongoing',
  }), 'slots');
}

async function setupDependencies() {
  await dbOperator.dropCollection('slots');
  const switchboards = await dbOperator.findAll('switchboards');
  switchboardId = switchboards[0].id;
  await dbOperator.update({
    id: switchboardId,
    amtTriggerStatus: 'off',
    e2eSlotCompletionDGObsoletionBehaviour: 'off',
    bugsAndTRsOnlyStatus: 'off',
    slotUgFailureBehaviour: 'obsolete',
    upgradeSlotMechanismStatus: 'sequential',
    numberOfDeliveryGroups: 2,
    lastModifiedBySignum: 'eaaaaa',
  }, 'switchboards');
}

describe('Integration Test: orchestrate post slot actions', () => {
  before(async () => {
    await setupDependencies();
  });
  beforeEach(async () => {
    const [storedTimePeriod] = await timePeriodsService.listTimePeriod();
    if (!storedTimePeriod) {
      await timePeriodsService.createNewTimePeriod({ lengthOfTimePeriod: '00:15' });
    }
  });
  it('should update a slot via post actions and not obsolete content', async () => {
    const slot = await addTestSlotToDatabase();
    const patchedSlot = await orchestratePostSlotActionsFunction(slot.id, {
      physicalStatus: 'failure',
    });
    expect(patchedSlot.physicalStatus).toBe('failure');
    expect(patchedSlot.cloudStatus).toBe('ongoing');
    expect(patchedSlot.slotStatus).toBe('ongoing');
    expect(patchedSlot.obsoletedDGs.length).toBe(0);
  });
  it('should execute post slot actions on a successful slot but should not obsolete content', async () => {
    const slot = await addTestSlotToDatabase();
    const patchedSlot = await orchestratePostSlotActionsFunction(slot.id, {
      physicalStatus: 'success',
      cloudStatus: 'success',
      rfa250Url: `${GERRIT_AMT};a=blob_plain;f=services/express/mocked-json/RFA250/2308bd5b-8234-4e9e-8089-3d6cfc56ece6.json;hb=refs/heads/master`,
      aptuUrl: `${GERRIT_AMT};a=blob_plain;f=services/express/mocked-json/APTU/294_20201116T200805.json;hb=refs/heads/master`,
      aduUrl: `${GERRIT_AMT};a=blob_plain;f=services/express/mocked-json/ADU/29f2ace1-7bd8-4db7-8a65-0782e9fd6695.json;hb=refs/heads/master`,
    });
    expect(patchedSlot.physicalStatus).toBe('success');
    expect(patchedSlot.cloudStatus).toBe('success');
    expect(patchedSlot.slotStatus).toBe('success');
    expect(patchedSlot.obsoletedDGs.length).toBe(0);
  });
  it('should execute post slot actions of a slot and obsolete all content when slotUgFailureBehaviour is obsolete', async () => {
    const slot = await addTestSlotToDatabase();
    await dbOperator.update({
      id: switchboardId,
      slotUgFailureBehaviour: 'obsolete',
    }, 'switchboards');
    const mockedOrchestratePostSlotActions = mockOrchestratePostSlotActionsWithoutPredictions();
    const patchedSlot = await mockedOrchestratePostSlotActions(slot.id, {
      physicalStatus: 'success',
      cloudStatus: 'failure',
      cloudUpgradeStatus: 'failure',
    });

    expect(patchedSlot.slotStatus).toBe('failure');
    expect(patchedSlot.physicalStatus).toBe('success');
    expect(patchedSlot.cloudStatus).toBe('failure');
    expect(patchedSlot.obsoletedDGs).toStrictEqual(patchedSlot.deliveredDGs);
    expect(patchedSlot.obsoletedDGs.length).toBe(patchedSlot.deliveredDGs.length);
  });
  it(`should execute post slot actions of a slot and obsolete all content when e2eSlotCompletionDGObsoletionBehaviour is All 
    when allure urls are not populated and slotUgFailureBehaviour is obsolete`, async () => {
    const slot = await addTestSlotToDatabase();
    await dbOperator.update({
      id: switchboardId,
      e2eSlotCompletionDGObsoletionBehaviour: 'all',
      slotUgFailureBehaviour: 'obsolete',
    }, 'switchboards');
    const mockedOrchestratePostSlotActions = mockOrchestratePostSlotActionsWithoutPredictions();
    const patchedSlot = await mockedOrchestratePostSlotActions(slot.id, {
      physicalStatus: 'success',
      cloudStatus: 'failure',
      physicalUpgradeStatus: '',
      cloudUpgradeStatus: '',
      aptuUrl: '',
    });

    expect(patchedSlot.slotStatus).toBe('failure');
    expect(patchedSlot.physicalStatus).toBe('success');
    expect(patchedSlot.cloudStatus).toBe('failure');
    expect(patchedSlot.obsoletedDGs).toStrictEqual(patchedSlot.deliveredDGs);
    expect(patchedSlot.obsoletedDGs.length).toBe(patchedSlot.deliveredDGs.length);
  });
  it(`should execute post slot actions of a slot and turn amt off when allure urls are not populated 
    and slotUgFailureBehaviour is shutdown`, async () => {
    const slot = await addTestSlotToDatabase();
    await dbOperator.update({
      id: switchboardId,
      amtTriggerStatus: 'on',
      e2eSlotCompletionDGObsoletionBehaviour: 'all',
      slotUgFailureBehaviour: 'shutdown',
    }, 'switchboards');
    const mockedOrchestratePostSlotActions = mockOrchestratePostSlotActionsWithoutPredictions();
    const patchedSlot = await mockedOrchestratePostSlotActions(slot.id, {
      physicalStatus: 'success',
      cloudStatus: 'failure',
      physicalUpgradeStatus: '',
      cloudUpgradeStatus: '',
      rfa250Url: '',
    });
    expect(patchedSlot.slotStatus).toBe('failure');
    expect(patchedSlot.physicalStatus).toBe('success');
    expect(patchedSlot.cloudStatus).toBe('failure');
    expect(patchedSlot.obsoletedDGs).toStrictEqual(patchedSlot.deliveredDGs);
    expect(patchedSlot.obsoletedDGs.length).toBe(patchedSlot.deliveredDGs.length);
  });
  it('should not update slot with obsolete delivery groups if they failed to obsolete', async () => {
    await dbOperator.update({
      id: switchboardId,
      e2eSlotCompletionDGObsoletionBehaviour: 'all',
      slotUgFailureBehaviour: 'obsolete',
    }, 'switchboards');
    const slot = await addTestSlotToDatabase();
    const mockedOrchestratePostSlotActions = mockOrchestratePostSlotActionsFailureScenario(slot);
    const patchedSlot = await mockedOrchestratePostSlotActions(slot.id, {
      physicalStatus: 'failure',
      cloudStatus: 'failure',
      physicalUpgradeStatus: 'failure',
    });
    const switchboard = await dbOperator.findById(switchboardId, 'switchboards');
    expect(patchedSlot.slotStatus).toBe('failure');
    expect(patchedSlot.physicalStatus).toBe('failure');
    expect(patchedSlot.cloudStatus).toBe('failure');
    expect(patchedSlot.obsoletedDGs.length).toBe(0);
    expect(switchboard[0].amtTriggerStatus).toBe('off');
    expect(switchboard[0].e2eSlotCompletionDGObsoletionBehaviour).toBe('off');
  });
  it('should not update slot when no dgs to obsolete', async () => {
    await dbOperator.update({
      id: switchboardId,
      e2eSlotCompletionDGObsoletionBehaviour: 'all',
    }, 'switchboards');
    const slot = await addTestSlotToDatabase();
    const patchedSlot = await orchestratePostSlotActionsFunction(slot.id, {
      physicalStatus: 'failure',
      deliveredDGs: [],
      cloudStatus: 'failure',
    });

    const switchboard = await dbOperator.findById(switchboardId, 'switchboards');
    expect(patchedSlot.slotStatus).toBe('failure');
    expect(patchedSlot.physicalStatus).toBe('failure');
    expect(patchedSlot.cloudStatus).toBe('failure');
    expect(patchedSlot.obsoletedDGs.length).toBe(0);
    expect(switchboard[0].amtTriggerStatus).toBe('off');
    expect(switchboard[0].e2eSlotCompletionDGObsoletionBehaviour).toBe('all');
  });
  afterEach(async () => {
    const switchboards = await dbOperator.findAll('switchboards');
    await dbOperator.update({
      id: switchboards[0].id,
      amtTriggerStatus: 'off',
      e2eSlotCompletionDGObsoletionBehaviour: 'off',
      bugsAndTRsOnlyStatus: 'off',
      slotUgFailureBehaviour: 'obsolete',
      upgradeSlotMechanismStatus: 'sequential',
      numberOfDeliveryGroups: 1,
      lastModifiedBySignum: 'eaaaaa',
    }, 'switchboards');
  });
  after(async () => {
    await dbOperator.dropCollection('slots');
    obsoleteDeliveryGroupsMock.restore();

    const [storedTimePeriod] = await timePeriodsService.listTimePeriod();
    if (storedTimePeriod) {
      await timePeriodsService.removeTimePeriod(storedTimePeriod);
    }
  });
});
