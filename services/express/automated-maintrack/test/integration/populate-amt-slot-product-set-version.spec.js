const expect = require('expect');

const { populateAmtSlotProductSetVersion } = require('../../use-cases');
const { dbOperator } = require('../../../data-access');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Integration Test: populate amt slot product set version', () => {
  before(async () => {
    await dbOperator.dropCollection('slots');
  });
  it('should populate a slot product set version', async () => {
    const slotToBeInserted = makeFakeSlot({ productSetVersion: 'pending' });
    const slotInserted = await dbOperator.insert(slotToBeInserted, 'slots');
    const patchedSlot = await populateAmtSlotProductSetVersion(slotInserted.id, {
      productSetVersion: '20.08.10',
    });
    expect(patchedSlot.physicalEnvironment).toBe(slotInserted.physicalEnvironment);
    expect(patchedSlot.cloudEnvironment).toBe(slotInserted.cloudEnvironment);
    expect(patchedSlot.deliveredDGs).toEqual(slotInserted.deliveredDGs);
    expect(patchedSlot.obsoletedDGs).toEqual(slotInserted.obsoletedDGs);
    expect(patchedSlot.slotStatus).toBe(slotInserted.slotStatus);
    expect(patchedSlot.physicalStatus).toBe(slotInserted.physicalStatus);
    expect(patchedSlot.cloudStatus).toBe(slotInserted.cloudStatus);
    expect(patchedSlot.slotType).toBe(slotInserted.slotType);
    expect(patchedSlot.productSetVersion).toBe('20.08.10');
  });
  after(async () => {
    await dbOperator.dropCollection('slots');
  });
});
