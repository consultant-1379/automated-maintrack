const expect = require('expect');

const { makeUgPassedAndNoTestResultsFailureBehaviourShutdown } = require('../../use-cases/orchestrate-post-slot-actions-helper/slot-failure-helper/ug-passed-and-no-test-results-failure-behaviour-shutdown');
const { makeFakeSlot } = require('./../../../__test__/fixtures/slot');

describe('Unit Test: Upgrade passed but all test results are not available so set to AMT shutdown use case', () => {
  it('should call the sendAmtUnableToMakePredictionsAndAmtToShutdown function', async () => {
    let sendAmtUnableToMakePredictionsAndShutdownAmtMailCalled = false;

    const ugPassedAndNoTestResultsFailureBehaviourShutdown = makeUgPassedAndNoTestResultsFailureBehaviourShutdown(
      {
        sendAmtUnableToMakePredictionsAndShutdownAmtMail: () => {
          sendAmtUnableToMakePredictionsAndShutdownAmtMailCalled = true;
        },
      }, {
        modifySwitchboard: () => null,
      },
    );
    const fakeSlot = makeFakeSlot({ aptuUrl: undefined });
    await ugPassedAndNoTestResultsFailureBehaviourShutdown(fakeSlot);
    expect(sendAmtUnableToMakePredictionsAndShutdownAmtMailCalled).toBeTruthy();
  });

  it('should call the modifySwitchboard function', async () => {
    let modifySwitchboard = false;

    const ugPassedAndNoTestResultsFailureBehaviourShutdown = makeUgPassedAndNoTestResultsFailureBehaviourShutdown(
      {
        sendAmtUnableToMakePredictionsAndShutdownAmtMail: () => null,
      }, {
        modifySwitchboard: () => {
          modifySwitchboard = true;
        },
      },
    );
    const fakeSlot = makeFakeSlot({ rfa250Url: undefined });
    await ugPassedAndNoTestResultsFailureBehaviourShutdown(fakeSlot);
    expect(modifySwitchboard).toBeTruthy();
  });

  it('should successfully return the slot', async () => {
    const ugPassedAndNoTestResultsFailureBehaviourShutdown = makeUgPassedAndNoTestResultsFailureBehaviourShutdown(
      {
        sendAmtUnableToMakePredictionsAndShutdownAmtMail: () => null,
      }, {
        modifySwitchboard: () => null,
      },
    );
    const fakeSlot = makeFakeSlot({ aduUrl: undefined });
    const slotReturnedFromUseCase = await ugPassedAndNoTestResultsFailureBehaviourShutdown(fakeSlot);
    expect(slotReturnedFromUseCase).toEqual(fakeSlot);
  });
});
