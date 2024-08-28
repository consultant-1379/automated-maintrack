const expect = require('expect');

const { makeSlotSuccessful } = require('../../use-cases/orchestrate-post-slot-actions-helper/slot-successful');
const { makeFakeSlot } = require('./../../../__test__/fixtures/slot');

describe('Unit Test: Slot successful post slot actions helper use case', () => {
  it('should return the slot', async () => {
    const slotSuccessful = makeSlotSuccessful(
      { sendAmtSlotFinishedSuccessfullyMail: () => null },
    );
    const fakeSlot = makeFakeSlot();
    const slotReturnedFromUseCase = await slotSuccessful(fakeSlot);
    expect(slotReturnedFromUseCase).toEqual(fakeSlot);
  });

  it('should call the sendAmtSlotFinishedSuccessfullyMail function', async () => {
    let sendSuccessfulMailSent = false;
    const slotSuccessful = makeSlotSuccessful(
      {
        sendAmtSlotFinishedSuccessfullyMail: () => {
          sendSuccessfulMailSent = true;
          return slotSuccessful;
        },
      },
    );
    const fakeSlot = makeFakeSlot();
    await slotSuccessful(fakeSlot);
    expect(sendSuccessfulMailSent).toBe(true);
  });
});
