const expect = require('expect');

const { makeUgPassedAndObsoletionStatusSetToAll } = require('../../use-cases/orchestrate-post-slot-actions-helper/slot-failure-helper/ug-passed-and-obsoletion-status-set-to-all');
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

describe('Unit Test: Upgrade passed and obsoletion status set to all use case', () => {
  it('should call function to orchesrate slot obsoletion predictions', async () => {
    let orchestrateSlotObsoletionPredictionsCalled = false;
    let sendAmtFailedToMakePredictionsAndShutdownAmtCalled = false;
    let modifySwitchboard = false;
    const ugPassedAndObsoletionStatusSetToAll = makeUgPassedAndObsoletionStatusSetToAll(
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
    await ugPassedAndObsoletionStatusSetToAll(fakeSlot, null, null, null, true);
    expect(orchestrateSlotObsoletionPredictionsCalled).toBeTruthy();
    expect(sendAmtFailedToMakePredictionsAndShutdownAmtCalled).toBeTruthy();
    expect(modifySwitchboard).toBeTruthy();
  });

  it('should call function to perform the common dg obsoletion logic', async () => {
    let commonDgObsoletionLogicCalled = false;
    const ugPassedAndObsoletionStatusSetToAll = makeUgPassedAndObsoletionStatusSetToAll(
      () => ({ predictions: PREDICTIONS_FOR_OBSOLETE_DELIVERY_GROUPS }),
      () => {
        commonDgObsoletionLogicCalled = true;
        return {};
      },
    );

    const fakeSlot = makeFakeSlot({ deliveredDGs: DELIVERY_GROUPS });
    await ugPassedAndObsoletionStatusSetToAll(fakeSlot, null, null, null, true);
    expect(commonDgObsoletionLogicCalled).toBeTruthy();
  });

  it('should call function to perform the common dg obsoletion logic when test results not available', async () => {
    let commonDgObsoletionLogicCalled = false;
    const ugPassedAndObsoletionStatusSetToAll = makeUgPassedAndObsoletionStatusSetToAll(
      () => ({ predictions: PREDICTIONS_FOR_OBSOLETE_DELIVERY_GROUPS }),
      () => {
        commonDgObsoletionLogicCalled = true;
        return {};
      },
    );

    const fakeSlot = makeFakeSlot({ deliveredDGs: DELIVERY_GROUPS });
    await ugPassedAndObsoletionStatusSetToAll(fakeSlot, null, null, null, false);
    expect(commonDgObsoletionLogicCalled).toBeTruthy();
  });

  it('should call function to send mail Predicted Obsoletions and no obsoletions are Srequired logic', async () => {
    let sendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMailCalled = false;
    const ugPassedAndObsoletionStatusSetToAll = makeUgPassedAndObsoletionStatusSetToAll(
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
    await ugPassedAndObsoletionStatusSetToAll(fakeSlot, null, null, null, true);
    expect(sendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMailCalled).toBeTruthy();
  });

  it('should call function to send mail that AMT failed to predict slot obesoletions', async () => {
    let sendAmtFailedToMakePredictionsAndShutdownAmtCalled = false;
    let modifySwitchboard = false;
    const ugPassedAndObsoletionStatusSetToAll = makeUgPassedAndObsoletionStatusSetToAll(
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

    const fakeSlot = makeFakeSlot({ deliveredDGs: DELIVERY_GROUPS });
    await ugPassedAndObsoletionStatusSetToAll(fakeSlot, null, null, null, true);
    expect(sendAmtFailedToMakePredictionsAndShutdownAmtCalled).toBeTruthy();
    expect(modifySwitchboard).toBeTruthy();
  });
});
