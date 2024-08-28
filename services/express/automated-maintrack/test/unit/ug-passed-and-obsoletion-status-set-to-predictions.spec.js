const expect = require('expect');

const { makeUgPassedAndObsoletionStatusSetToPredictions } = require('../../use-cases/orchestrate-post-slot-actions-helper/slot-failure-helper/ug-passed-and-obsoletion-status-set-to-predictions');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

const DELIVERY_GROUPS = [
  {
    createdByTeam: 'Trigger',
    deliveryGroupId: '44183',
    includedCategories: 'ms',
    typeOfDelivery: 'auto',
    deliveredRpms: [{
      name: 'ERICtrigger_CXP9030570',
      category: 'ms',
      version: '4.3.6',
    }],
  },
  {
    createdByTeam: 'Aztec',
    deliveryGroupId: '44195',
    includedCategories: 'service,model,testware',
    typeOfDelivery: 'auto',
    deliveredRpms: [{
      name: 'ERICazte_CXP9030890',
      category: 'service',
      version: '1.5.9',
    }],
  },
];

const PREDICTIONS_FOR_NO_OBSOLETE_DELIVERY_GROUPS = {
  44183: {
    action: 'Do not obsolete',
    confidence_in_keeping_dg: '97%',
  },
  44195: {
    action: 'Do not obsolete',
    confidence_in_keeping_dg: '98%',
  },
};

const PREDICTIONS_FOR_OBSOLETE_DELIVERY_GROUPS = {
  44183: {
    action: 'Do not obsolete',
    confidence_in_keeping_dg: '97%',
  },
  44195: {
    action: 'Obsolete',
    confidence_in_keeping_dg: '98%',
  },
};

describe('Unit Test: Upgrade passed and obsoletion status set to predictions use case', () => {
  it('should call function to orchesrate slot obsoletion predictions', async () => {
    let orchestrateSlotObsoletionPredictionsCalled = false;
    let sendAmtFailedToMakePredictionsAndShutdownAmtCalled = false;
    let modifySwitchboard = false;
    const ugPassedAndObsoletionStatusSetToPredictions = makeUgPassedAndObsoletionStatusSetToPredictions(
      () => {
        orchestrateSlotObsoletionPredictionsCalled = true;
        return false;
      },
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
    );

    const fakeSlot = makeFakeSlot();
    await ugPassedAndObsoletionStatusSetToPredictions(fakeSlot, null, null, null);
    expect(orchestrateSlotObsoletionPredictionsCalled).toBeTruthy();
    expect(sendAmtFailedToMakePredictionsAndShutdownAmtCalled).toBeTruthy();
    expect(modifySwitchboard).toBeTruthy();
  });

  it('should call function to perform common dg obsoletion logic', async () => {
    let commonDgObsoletionLogicCalled = false;
    const ugPassedAndObsoletionStatusSetToPredictions = makeUgPassedAndObsoletionStatusSetToPredictions(
      () => ({ predictions: PREDICTIONS_FOR_OBSOLETE_DELIVERY_GROUPS }),
      () => {
        commonDgObsoletionLogicCalled = true;
        return {};
      },
      {
        sendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMail: () => null,
        sendAmtFailedToMakePredictionsAndShutdownAmtMail: () => null,
        modifySwitchboard: () => null,
      },
    );

    const fakeSlot = makeFakeSlot({ deliveredDGs: DELIVERY_GROUPS });
    await ugPassedAndObsoletionStatusSetToPredictions(fakeSlot, null, null, null);
    expect(commonDgObsoletionLogicCalled).toBeTruthy();
  });

  it('should call function to send mail predicted obsoletions and no obsoletions are required logic', async () => {
    let sendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMailCalled = false;
    const ugPassedAndObsoletionStatusSetToPredictions = makeUgPassedAndObsoletionStatusSetToPredictions(
      () => ({ predictions: PREDICTIONS_FOR_NO_OBSOLETE_DELIVERY_GROUPS }),
      () => null,
      {
        sendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMail: () => {
          sendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMailCalled = true;
        },
      },
      {
        sendAmtFailedToMakePredictionsAndShutdownAmtMail: () => null,
      },
    );

    const fakeSlot = makeFakeSlot({ deliveredDGs: DELIVERY_GROUPS });
    await ugPassedAndObsoletionStatusSetToPredictions(fakeSlot, null, null, null);
    expect(sendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMailCalled).toBeTruthy();
  });

  it('should call function to send mail that AMT failed to predict slot obesoletions', async () => {
    let sendAmtFailedToMakePredictionsAndShutdownAmtCalled = false;
    let modifySwitchboard = false;
    const ugPassedAndObsoletionStatusSetToPredictions = makeUgPassedAndObsoletionStatusSetToPredictions(
      () => null,
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
    );

    const fakeSlot = makeFakeSlot();
    await ugPassedAndObsoletionStatusSetToPredictions(fakeSlot, null, null, null);
    expect(sendAmtFailedToMakePredictionsAndShutdownAmtCalled).toBeTruthy();
    expect(modifySwitchboard).toBeTruthy();
  });
});
