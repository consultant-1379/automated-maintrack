const expect = require('expect');

const { makeOrchestrateSlotObsoletionPredictions } = require('../../use-cases/orchestrate-post-slot-actions-helper/slot-failure-helper/orchestrate-slot-obsoletion-predictions');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Unit Test: Orchestrate slot obsoletion predictions use case', () => {
  it('should call function to retrieve list of known issues', async () => {
    let retrieveListOfKnownIssuesNamesCalled = false;
    const orchestrateSlotObsoletionPredictions = makeOrchestrateSlotObsoletionPredictions(
      {
        retrieveListOfKnownIssuesNames: () => {
          retrieveListOfKnownIssuesNamesCalled = true;
        },
      },
      {
        predictSlotObsoletions: () => null,
        updateSlot: () => null,
      },
    );

    const fakeSlot = makeFakeSlot();
    await orchestrateSlotObsoletionPredictions(fakeSlot);
    expect(retrieveListOfKnownIssuesNamesCalled).toBeTruthy();
  });

  it('should call function to predict slot obsoletions', async () => {
    let predictSlotObsoletionsCalled = false;
    const orchestrateSlotObsoletionPredictions = makeOrchestrateSlotObsoletionPredictions(
      {
        retrieveListOfKnownIssuesNames: () => null,
      },
      {
        predictSlotObsoletions: () => {
          predictSlotObsoletionsCalled = true;
        },
        updateSlot: () => null,
      },
    );

    const fakeSlot = makeFakeSlot();
    await orchestrateSlotObsoletionPredictions(fakeSlot);
    expect(predictSlotObsoletionsCalled).toBeTruthy();
  });

  it('should call function to update slot', async () => {
    let updateSlotCalled = false;
    const orchestrateSlotObsoletionPredictions = makeOrchestrateSlotObsoletionPredictions(
      {
        retrieveListOfKnownIssuesNames: () => null,
      },
      {
        predictSlotObsoletions: () => null,
        updateSlot: () => {
          updateSlotCalled = true;
        },
      },
    );

    const fakeSlot = makeFakeSlot();
    await orchestrateSlotObsoletionPredictions(fakeSlot);

    expect(updateSlotCalled).toBeTruthy();
  });

  it('should return predictions and the updated slot', async () => {
    const predictions = [{
      DG1: 'Do Not Obsolete',
    }];
    const updatedSlot = [{
      slotKey: 'Slot Value',
    }];
    const orchestrateSlotObsoletionPredictions = makeOrchestrateSlotObsoletionPredictions(
      {
        retrieveListOfKnownIssuesNames: () => null,
      },
      {
        predictSlotObsoletions: () => predictions,
        updateSlot: () => updatedSlot,
      },
    );

    const fakeSlot = makeFakeSlot();
    const outputFromaOrchestrateSlotObsoletionPredictions = await orchestrateSlotObsoletionPredictions(fakeSlot);
    expect(outputFromaOrchestrateSlotObsoletionPredictions).toEqual({ predictions, updatedSlot });
  });
});
