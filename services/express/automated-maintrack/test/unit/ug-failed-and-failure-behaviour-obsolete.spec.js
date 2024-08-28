const expect = require('expect');

const { makeUgFailedAndFailureBehaviourObsolete } = require('../../use-cases/orchestrate-post-slot-actions-helper/slot-failure-helper/ug-failed-and-failure-behaviour-obsolete');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Unit Test: Upgrade failed and upgrade failure behaviour is set to obsolete use case', () => {
  it('should call commonDgObsoletionLogic function', async () => {
    let calledCommonDgObsoletionLogic = false;
    const ugFailedAndFailureBehaviourObsolete = makeUgFailedAndFailureBehaviourObsolete(
      () => {
        calledCommonDgObsoletionLogic = true;
      },
    );

    const fakeSlot = makeFakeSlot();
    await ugFailedAndFailureBehaviourObsolete(fakeSlot);
    expect(calledCommonDgObsoletionLogic).toBeTruthy();
  });

  it('should ensure that all delivery groups are called to be obsoleted by the commonDgObsoletionLogic function', async () => {
    const fakeSlot = makeFakeSlot();
    const ugFailedAndFailureBehaviourObsolete = makeUgFailedAndFailureBehaviourObsolete(
      () => fakeSlot,
    );

    const updatedSlot = await ugFailedAndFailureBehaviourObsolete(fakeSlot);
    expect(fakeSlot.deliveredDGs).toEqual(updatedSlot.deliveredDGs);
  });
});
