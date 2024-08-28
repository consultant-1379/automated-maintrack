const expect = require('expect');
const nock = require('nock');

const { setSlotPropertiesFailedIfNecessary } = require('../../use-cases');

const { dbOperator } = require('../../../data-access');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

const { EMT_URL } = process.env;

const SEARCH_FOR_DEPLOYMENT_URL = '/api/deployments/search?q=name=';

async function generateFakeSlotAndInsertToDB(productSetVersion, slotStatus, physicalStatus, cloudStatus, physicalEnvironment, cloudEnvironment) {
  const slotToInsert = makeFakeSlot({
    productSetVersion, slotStatus, physicalStatus, cloudStatus, physicalEnvironment, cloudEnvironment,
  });
  await dbOperator.insert(slotToInsert, 'slots');
  return slotToInsert.id;
}

async function setupDependencies() {
  await dbOperator.dropCollection('slots');
  await generateFakeSlotAndInsertToDB('20.10.123', 'failure', 'failure', 'success');
  nock.cleanAll();
}

function setNockResponse(environmentName, productSet, state) {
  nock(EMT_URL).get(SEARCH_FOR_DEPLOYMENT_URL + environmentName).reply(200, [{
    productSet, state,
  }]);
}

describe('Integration Test: Slot cleanup', () => {
  beforeEach(async () => {
    await setupDependencies();
  });

  it('should not clean up an already completed slot', async () => {
    await setSlotPropertiesFailedIfNecessary();
    const slotsFromDB = await dbOperator.findAll('slots');

    expect(slotsFromDB[0].slotStatus).toBe('failure');
    expect(slotsFromDB[0].physicalStatus).toBe('failure');
    expect(slotsFromDB[0].cloudStatus).toBe('success');
  });

  it('should not clean up an ongoing slot, if the data in said slot is accurate on one ongoing platform type', async () => {
    const insertedSlotId = await generateFakeSlotAndInsertToDB('20.10.124', 'ongoing', 'failure', 'ongoing', '339', 'ieatenmc7a12');
    setNockResponse('ieatenmc7a12', '20.10.124', 'BUSY');
    await setSlotPropertiesFailedIfNecessary();
    const slotFromDB = await dbOperator.findById(insertedSlotId, 'slots');

    expect(slotFromDB[0].slotStatus).toBe('ongoing');
    expect(slotFromDB[0].physicalStatus).toBe('failure');
    expect(slotFromDB[0].cloudStatus).toBe('ongoing');
  });

  it('should not clean up an ongoing slot, if the data in said slot is accurate on both ongoing platform types', async () => {
    const insertedSlotId = await generateFakeSlotAndInsertToDB('20.10.123', 'ongoing', 'ongoing', 'ongoing', '339', 'ieatenmc7a12');
    setNockResponse('339', '20.10.123', 'BUSY');
    setNockResponse('ieatenmc7a12', '20.10.123', 'BUSY');
    await setSlotPropertiesFailedIfNecessary();
    const slotFromDB = await dbOperator.findById(insertedSlotId, 'slots');

    expect(slotFromDB[0].slotStatus).toBe('ongoing');
    expect(slotFromDB[0].physicalStatus).toBe('ongoing');
    expect(slotFromDB[0].cloudStatus).toBe('ongoing');
  });

  it('should not clean up an ongoing slot, if one platformTypes environment is pending, but the other is accurate', async () => {
    const insertedSlotId = await generateFakeSlotAndInsertToDB('20.10.123', 'ongoing', 'ongoing', 'pending', '339', 'pending');
    setNockResponse('339', '20.10.123', 'BUSY');
    await setSlotPropertiesFailedIfNecessary();
    const slotFromDB = await dbOperator.findById(insertedSlotId, 'slots');

    expect(slotFromDB[0].slotStatus).toBe('ongoing');
    expect(slotFromDB[0].physicalStatus).toBe('ongoing');
    expect(slotFromDB[0].cloudStatus).toBe('pending');
  });

  it('should cleanup an ongoing slot, if one platformTypes environment is pending, and the other is innacurate', async () => {
    const insertedSlotId = await generateFakeSlotAndInsertToDB('20.10.123', 'ongoing', 'ongoing', 'pending', '339', 'pending');
    setNockResponse('339', '20.10.123', 'QUARANTINE');
    await setSlotPropertiesFailedIfNecessary();
    const slotFromDB = await dbOperator.findById(insertedSlotId, 'slots');

    expect(slotFromDB[0].slotStatus).toBe('failure');
    expect(slotFromDB[0].physicalStatus).toBe('ongoing');
    expect(slotFromDB[0].cloudStatus).toBe('pending');
  });

  it('should not cleanup an ongoing slot, if the productSetVersion attached to slot is pending, and it has one ongoing environment', async () => {
    const insertedSlotId = await generateFakeSlotAndInsertToDB('pending', 'ongoing', 'pending', 'ongoing', 'pending', 'ieatenmc7a12');
    setNockResponse('ieatenmc7a12', '20.10.127', 'BUSY');
    await setSlotPropertiesFailedIfNecessary();
    const slotFromDB = await dbOperator.findById(insertedSlotId, 'slots');

    expect(slotFromDB[0].slotStatus).toBe('ongoing');
    expect(slotFromDB[0].physicalStatus).toBe('pending');
    expect(slotFromDB[0].cloudStatus).toBe('ongoing');
  });

  it('should not cleanup an ongoing slot, if the productSetVersion attached to slot is pending, but it has ongoing environments', async () => {
    const insertedSlotId = await generateFakeSlotAndInsertToDB('pending', 'ongoing', 'ongoing', 'ongoing', '339', 'ieatenmc7a12');
    setNockResponse('339', '20.10.123', 'BUSY');
    setNockResponse('ieatenmc7a12', '20.10.127', 'BUSY');
    await setSlotPropertiesFailedIfNecessary();
    const slotFromDB = await dbOperator.findById(insertedSlotId, 'slots');

    expect(slotFromDB[0].slotStatus).toBe('ongoing');
    expect(slotFromDB[0].physicalStatus).toBe('ongoing');
    expect(slotFromDB[0].cloudStatus).toBe('ongoing');
  });

  it('should set an ongoing slot to failure if both environments are busy but the productSetVersion is inaccurate on the environments', async () => {
    const insertedSlotId = await generateFakeSlotAndInsertToDB('20.10.123', 'ongoing', 'ongoing', 'ongoing', '339', 'ieatenmc7a12');
    setNockResponse('339', '20.10.124', 'BUSY');
    setNockResponse('ieatenmc7a12', '20.10.127', 'BUSY');
    await setSlotPropertiesFailedIfNecessary();
    const slotFromDB = await dbOperator.findById(insertedSlotId, 'slots');

    expect(slotFromDB[0].slotStatus).toBe('failure');
    expect(slotFromDB[0].physicalStatus).toBe('ongoing');
    expect(slotFromDB[0].cloudStatus).toBe('ongoing');
  });
});
