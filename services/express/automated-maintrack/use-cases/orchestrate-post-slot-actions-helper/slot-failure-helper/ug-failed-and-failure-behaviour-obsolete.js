function makeUgFailedAndFailureBehaviourObsolete(commonDgObsoletionLogic) {
  return async function ugFailedAndFailureBehaviourObsolete(slot, e2eSlotCompletionDGObsoletionBehaviour,
    bugsAndTRsOnlyStatus, slotUgFailureBehaviour) {
    const updatedSlot = await commonDgObsoletionLogic(slot, slot.deliveredDGs, undefined, e2eSlotCompletionDGObsoletionBehaviour,
      bugsAndTRsOnlyStatus, slotUgFailureBehaviour, 'failure');
    return updatedSlot;
  };
}

module.exports = { makeUgFailedAndFailureBehaviourObsolete };
