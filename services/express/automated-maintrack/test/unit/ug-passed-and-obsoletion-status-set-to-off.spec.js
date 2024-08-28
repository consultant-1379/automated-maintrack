const expect = require('expect');

const { makeUgPassedAndObsoletionStatusSetToOff } = require('../../use-cases/orchestrate-post-slot-actions-helper/slot-failure-helper/ug-passed-and-obsoletion-status-set-to-off');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Unit Test: Upgrade passed and obsoletion status set to off use case', () => {
  it('should call function to orchesrate slot obsoletion predictions', async () => {
    let orchestrateSlotObsoletionPredictionsCalled = false;
    const ugPassedAndObsoletionStatusSetToOff = makeUgPassedAndObsoletionStatusSetToOff(
      () => {
        orchestrateSlotObsoletionPredictionsCalled = true;
        return {};
      },
      {
        sendAmtHasMadeObsoletionPredictionEmail: () => null,
        sendAmtFailedToMakePredictionsAndShutdownAmtMail: () => null,
        modifySwitchboard: () => null,
      },
    );

    const fakeSlot = makeFakeSlot();
    await ugPassedAndObsoletionStatusSetToOff(fakeSlot, null, null);
    expect(orchestrateSlotObsoletionPredictionsCalled).toBeTruthy();
  });

  it('should call function to send email that AMT has made predictions', async () => {
    let sendAmtHasMadeObsoletionPredictionEmailCalled = false;
    const ugPassedAndObsoletionStatusSetToAll = makeUgPassedAndObsoletionStatusSetToOff(
      () => ({ predictions: true }),
      {
        sendAmtHasMadeObsoletionPredictionEmail: () => {
          sendAmtHasMadeObsoletionPredictionEmailCalled = true;
        },
      },
      {
        sendAmtFailedToMakePredictionsAndShutdownAmtMail: () => null,
        modifySwitchboard: () => null,
      },
    );

    const fakeSlot = makeFakeSlot();
    await ugPassedAndObsoletionStatusSetToAll(fakeSlot, null, null);
    expect(sendAmtHasMadeObsoletionPredictionEmailCalled).toBeTruthy();
  });

  it('should call function to send email that AMT failed to make predictions', async () => {
    let sendAmtFailedToMakePredictionsAndShutdownAmtCalled = false;
    let modifySwitchboard = false;
    const ugPassedAndObsoletionStatusSetToOff = makeUgPassedAndObsoletionStatusSetToOff(
      () => null,
      {
        sendAmtFailedToMakePredictionsAndShutdownAmtMail: () => {
          sendAmtFailedToMakePredictionsAndShutdownAmtCalled = true;
        },
      },
      {
        modifySwitchboard: () => {
          modifySwitchboard = true;
        },
      },
      {
        sendAmtHasMadeObsoletionPredictionEmail: () => null,
      },
    );

    const fakeSlot = makeFakeSlot();
    await ugPassedAndObsoletionStatusSetToOff(fakeSlot, null, null);
    expect(sendAmtFailedToMakePredictionsAndShutdownAmtCalled).toBeTruthy();
    expect(modifySwitchboard).toBeTruthy();
  });
});
