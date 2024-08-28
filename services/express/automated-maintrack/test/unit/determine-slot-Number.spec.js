const expect = require('expect');

const { makeDeteremineSlotNumber } = require('../../use-cases/determine-slot-number');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');
const { makeFakeFailureTracker } = require('../../../__test__/fixtures/failureTracker');

const FULL_SLOT_LIST_SLOT_TWO = [
  {
    physicalEnvironment: '339',
    cloudEnvironment: 'ieatenmc3b01',
    deliveryGroupId: '51419',
    createdByTeam: 'Vasista',
    includedCategories: 'model,scripting',
    typeOfDelivery: 'auto',
    obsoletedDGs: '',
    slotStatus: 'failure',
    physicalStatus: 'failure',
    cloudStatus: 'failure',
    productSetVersion: '21.03.11',
    slotType: 'automatic',
    slotNumber: 'first',
  },
  {
    physicalEnvironment: '339',
    cloudEnvironment: 'ieatenmc3b01',
    includedCategories: 'model,scripting',
    createdByTeam: 'Vasista',
    deliveryGroupId: '51418',
    typeOfDelivery: 'auto',
    obsoletedDGs: '',
    slotStatus: 'failure',
    physicalStatus: 'failure',
    cloudStatus: 'failure',
    productSetVersion: '21.03.11',
    slotType: 'automatic',
    slotNumber: 'second',
  },
];

const FULL_SLOT_LIST_SLOT_ONE = [
  {
    physicalEnvironment: '339',
    cloudEnvironment: 'ieatenmc3b01',
    deliveryGroupId: '51419',
    includedCategories: 'model,scripting',
    createdByTeam: 'Vasista',
    typeOfDelivery: 'auto',
    obsoletedDGs: '',
    slotStatus: 'failure',
    physicalStatus: 'failure',
    cloudStatus: 'failure',
    productSetVersion: '21.03.11',
    slotType: 'automatic',
    slotNumber: 'first',
  },
  {
    physicalEnvironment: '339',
    cloudEnvironment: 'ieatenmc3b01',
    createdByTeam: 'Vasista',
    deliveryGroupId: '51418',
    includedCategories: 'model,scripting',
    typeOfDelivery: 'auto',
    obsoletedDGs: '',
    slotStatus: 'failure',
    physicalStatus: 'failure',
    cloudStatus: 'failure',
    productSetVersion: '21.03.11',
    slotType: 'automatic',
    slotNumber: 'first',
  },
];

const FULL_SLOT_LIST_SLOT_FAILURE = [
  {
    physicalEnvironment: '339',
    cloudEnvironment: 'ieatenmc3b01',
    deliveryGroupId: '51419',
    includedCategories: 'model,scripting',
    createdByTeam: 'Vasista',
    typeOfDelivery: 'auto',
    obsoletedDGs: '',
    slotStatus: 'ongoing',
    physicalStatus: 'ongoing',
    cloudStatus: 'ongoing',
    productSetVersion: '21.03.11',
    slotType: 'automatic',
    slotNumber: 'first',
  },
  {
    physicalEnvironment: '339',
    cloudEnvironment: 'ieatenmc3b01',
    createdByTeam: 'Vasista',
    deliveryGroupId: '51418',
    includedCategories: 'model,scripting',
    typeOfDelivery: 'auto',
    obsoletedDGs: '',
    slotStatus: 'failure',
    physicalStatus: 'failure',
    cloudStatus: 'failure',
    productSetVersion: '21.03.11',
    slotType: 'automatic',
    slotNumber: 'second',
  },
];

describe('Unit Test: To Determine the correct slot number', () => {
  const failureTracker = makeFakeFailureTracker();
  it('should throw an error if first slot is ongoing and second slot is completed', (done) => {
    const fakeSlot = makeFakeSlot({ slotStatus: 'ongoing', slotNumber: 'first' });

    const determineSlotNumber = makeDeteremineSlotNumber(
      { searchForSlots: () => [fakeSlot] },
      { },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
    );

    determineSlotNumber(FULL_SLOT_LIST_SLOT_FAILURE, failureTracker).catch((error) => {
      expect(error.message).toBe('AMT Could not trigger another slot as the first slot within a parallel slot coupling is still ongoing.');
    })
      .then(done, done);
  });

  it('should check to return the correct slot Number when a slot is ongoing', async () => {
    const fakeSlot = makeFakeSlot({ slotStatus: 'ongoing', slotNumber: 'first' });
    const determineSlotNumber = makeDeteremineSlotNumber(
      { searchForSlots: () => [fakeSlot] },
      { },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
    );

    const nextSlotNumber = await determineSlotNumber(FULL_SLOT_LIST_SLOT_ONE);
    expect(nextSlotNumber).toEqual('second');
  });

  it('should check to return the correct slot Number when no slots are ongoing', async () => {
    const fakeSlot = makeFakeSlot({ slotStatus: 'ongoing', slotNumber: 'second' });
    const determineSlotNumber = makeDeteremineSlotNumber(
      { searchForSlots: () => [fakeSlot] },
      { },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
    );
    const nextSlotNumber = await determineSlotNumber(FULL_SLOT_LIST_SLOT_TWO);
    expect(nextSlotNumber).toEqual('first');
  });
});
