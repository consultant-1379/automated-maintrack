const expect = require('expect');

const { makeSlotFailure } = require('../../use-cases/orchestrate-post-slot-actions-helper/slot-failure');
const { makeFakeSlot } = require('./../../../__test__/fixtures/slot');

describe('Unit Test: Slot failure post slot actions helper use case', () => {
  it('should call ugFailedAndFailureBehaviourShutdown when the upgrade was not successful and the slotUgFailureBehaviour is shutdown', async () => {
    let ugFailedAndFailureBehaviourShutdownCalled = false;
    const slotFailure = makeSlotFailure({
      ugFailedAndFailureBehaviourShutdown: () => {
        ugFailedAndFailureBehaviourShutdownCalled = true;
      },
      ugFailedAndFailureBehaviourObsolete: () => null,
    }, {
      retrieveSlotUgFailureBehaviour: () => 'shutdown',
      retrieveE2eSlotCompletionDGObsoletionBehaviour: () => null,
      retrieveBugsAndTRsOnlyStatus: () => null,
    });

    const fakeSlot = makeFakeSlot({ cloudUpgradeStatus: 'failure' });
    await slotFailure(fakeSlot);
    expect(ugFailedAndFailureBehaviourShutdownCalled).toBeTruthy();
  });

  it('should call ugFailedAndFailureBehaviourObsolete when the upgrade was not successful, the slotUgFailureBehaviour is obsolete', async () => {
    let ugFailedAndFailureBehaviourObsoleteCalled = false;
    const slotFailure = makeSlotFailure({
      ugFailedAndFailureBehaviourShutdown: () => null,
      ugFailedAndFailureBehaviourObsolete: () => {
        ugFailedAndFailureBehaviourObsoleteCalled = true;
      },
    }, {
      retrieveSlotUgFailureBehaviour: () => 'obsolete',
      retrieveE2eSlotCompletionDGObsoletionBehaviour: () => null,
      retrieveBugsAndTRsOnlyStatus: () => null,
    });

    const fakeSlot = makeFakeSlot({ physicalUpgradeStatus: 'failure' });
    await slotFailure(fakeSlot);
    expect(ugFailedAndFailureBehaviourObsoleteCalled).toBeTruthy();
  });
});
