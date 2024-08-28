const expect = require('expect');

const { buildSetSlotsFailedIfNecessary } = require('../../use-cases/set-slots-failed-if-necessary');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Test: Set slots failed if necessary', () => {
  it('should not modify any slot and should return an appropriate message if there are no ongoing slots', async () => {
    const setSlotsFailedIfNecessary = buildSetSlotsFailedIfNecessary(
      { searchForSlots: () => [], updateSlot: () => {} },
      { verifyEnvironmentStateBusyWithExpectedProductSetVersion: () => true },
      { sendAmtHasInaccurateSlotData: () => {} },
    );
    const slotsUpdatedReturnMessage = await setSlotsFailedIfNecessary();
    expect(slotsUpdatedReturnMessage).toBe('No ongoing slots, no slot cleanup necessary');
  });

  it('should not modify any slot and should return an appropriate message if there are accurate slots ongoing', async () => {
    const slot = makeFakeSlot({ slotStatus: 'ongoing', cloudStatus: 'ongoing', physicalStatus: 'ongoing' });
    const setSlotsFailedIfNecessary = buildSetSlotsFailedIfNecessary(
      { searchForSlots: () => [slot], updateSlot: () => {} },
      { verifyEnvironmentStateBusyWithExpectedProductSetVersion: () => true },
      { sendAmtHasInaccurateSlotData: () => {} },
    );
    const slotsUpdatedReturnMessage = await setSlotsFailedIfNecessary();
    expect(slotsUpdatedReturnMessage).toBe('Slot data accurate and so no slot cleanup necessary');
  });

  it('should not modify any slot and should return an appropriate message if only one platform is ongoing but slot data is accurate', async () => {
    const slot = makeFakeSlot({ slotStatus: 'ongoing', cloudStatus: 'failure', physicalStatus: 'ongoing' });
    const setSlotsFailedIfNecessary = buildSetSlotsFailedIfNecessary(
      { searchForSlots: () => [slot], updateSlot: () => {} },
      { verifyEnvironmentStateBusyWithExpectedProductSetVersion: () => true },
      { sendAmtHasInaccurateSlotData: () => {} },
    );
    const slotsUpdatedReturnMessage = await setSlotsFailedIfNecessary();
    expect(slotsUpdatedReturnMessage).toBe('Slot data accurate and so no slot cleanup necessary');
  });

  it('should update the overall slotStatus from ongoing to failure if both cloudStatus and physicalStatus are failure or success', async () => {
    const slot = makeFakeSlot({ slotStatus: 'ongoing', cloudStatus: 'failure', physicalStatus: 'success' });
    const setSlotsFailedIfNecessary = buildSetSlotsFailedIfNecessary(
      { searchForSlots: () => [slot], updateSlot: () => {} },
      { verifyEnvironmentStateBusyWithExpectedProductSetVersion: () => true },
      { sendAmtHasInaccurateSlotData: () => {} },
    );
    const slotsUpdatedReturnMessage = await setSlotsFailedIfNecessary();
    expect(slotsUpdatedReturnMessage).toBe('Successfully updated inaccurate slot');
  });

  it('should update the overall slotStatus from ongoing to failure if your slot data is inaccurate', async () => {
    const slot = makeFakeSlot({ slotStatus: 'ongoing', cloudStatus: 'ongoing', physicalStatus: 'ongoing' });
    const setSlotsFailedIfNecessary = buildSetSlotsFailedIfNecessary(
      { searchForSlots: () => [slot], updateSlot: () => {} },
      { verifyEnvironmentStateBusyWithExpectedProductSetVersion: () => false },
      { sendAmtHasInaccurateSlotData: () => {} },
    );
    const slotsUpdatedReturnMessage = await setSlotsFailedIfNecessary();
    expect(slotsUpdatedReturnMessage).toBe('Successfully updated inaccurate slot');
  });

  it('should update the slot to failed if the environment names associated with your slot are pending', async () => {
    const slot = makeFakeSlot({ slotStatus: 'ongoing', cloudEnvironment: 'pending', physicalEnvironment: 'pending' });
    const setSlotsFailedIfNecessary = buildSetSlotsFailedIfNecessary(
      { searchForSlots: () => [slot], updateSlot: () => {} },
      null,
      { sendAmtHasInaccurateSlotData: () => {} },
    );
    const slotsUpdatedReturnMessage = await setSlotsFailedIfNecessary();
    expect(slotsUpdatedReturnMessage).toBe('Successfully updated inaccurate slot');
  });

  it('should not update slot if productSet is pending but one of the environments is accurate in EMT', async () => {
    const slot = makeFakeSlot({
      slotStatus: 'ongoing', productSetVersion: 'pending', cloudStatus: 'ongoing', physicalStatus: 'failure',
    });
    const setSlotsFailedIfNecessary = buildSetSlotsFailedIfNecessary(
      { searchForSlots: () => [slot], updateSlot: () => {} },
      { verifyEnvironmentStateBusyWithExpectedProductSetVersion: () => true },
      { sendAmtHasInaccurateSlotData: () => {} },
    );
    const slotsUpdatedReturnMessage = await setSlotsFailedIfNecessary();
    expect(slotsUpdatedReturnMessage).toBe('Slot data accurate and so no slot cleanup necessary');
  });

  it('should update slot if productSet is pending but one of the environments is not accurate in EMT', async () => {
    const slot = makeFakeSlot({
      slotStatus: 'ongoing', productSetVersion: 'pending', cloudStatus: 'ongoing', physicalStatus: 'failure',
    });
    const setSlotsFailedIfNecessary = buildSetSlotsFailedIfNecessary(
      { searchForSlots: () => [slot], updateSlot: () => {} },
      { verifyEnvironmentStateBusyWithExpectedProductSetVersion: () => false },
      { sendAmtHasInaccurateSlotData: () => {} },
    );
    const slotsUpdatedReturnMessage = await setSlotsFailedIfNecessary();
    expect(slotsUpdatedReturnMessage).toBe('Successfully updated inaccurate slot');
  });
});
