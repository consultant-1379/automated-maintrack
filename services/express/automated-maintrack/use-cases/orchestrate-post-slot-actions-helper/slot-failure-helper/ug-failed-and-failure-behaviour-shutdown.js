function makeUgFailedAndFailureBehaviourShutdown(sendEmailService, switchboardService) {
  return async function ugFailedAndFailureBehaviourShutdown(slot, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus,
    slotUgFailureBehaviour) {
    await sendEmailService.sendUpgradeFailureMail(slot, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus, slotUgFailureBehaviour);
    await switchboardService.modifySwitchboard({ amtTriggerStatus: 'off', lastModifiedBySignum: 'AMTEL' });
    return slot;
  };
}

module.exports = { makeUgFailedAndFailureBehaviourShutdown };
