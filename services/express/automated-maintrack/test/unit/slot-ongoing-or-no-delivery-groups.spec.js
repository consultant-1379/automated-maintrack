const expect = require('expect');

const { makeSlotOngoingOrNoDeliveryGroups } = require('../../use-cases/orchestrate-post-slot-actions-helper/slot-ongoing-or-no-delivery-groups');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Unit Test: Slot ongoing or no delivery groups post slot actions helper use case', () => {
  it('should return the slot', () => {
    const slotOngoingOrNoDeliveryGroups = makeSlotOngoingOrNoDeliveryGroups();
    const fakeSlot = makeFakeSlot();
    const slotReturnedFromUseCase = slotOngoingOrNoDeliveryGroups(fakeSlot);
    expect(slotReturnedFromUseCase).toEqual(fakeSlot);
  });
});
