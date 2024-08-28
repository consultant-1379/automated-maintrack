function makeSlotFailure(slotFailureHelper, switchboardService) {
  return async function slotFailure(slot) {
    const failureUpgrade = Boolean(slot.physicalUpgradeStatus || slot.cloudUpgradeStatus);
    const RequiredTestResults = Boolean(slot.rfa250Url && slot.aptuUrl && slot.aduUrl);
    const slotUgFailureBehaviour = await switchboardService.retrieveSlotUgFailureBehaviour();
    const e2eSlotCompletionDGObsoletionBehaviour = await switchboardService.retrieveE2eSlotCompletionDGObsoletionBehaviour();
    const bugsAndTRsOnlyStatus = await switchboardService.retrieveBugsAndTRsOnlyStatus();

    if (!failureUpgrade) {
      if (e2eSlotCompletionDGObsoletionBehaviour === 'all') {
        slot = await slotFailureHelper.ugPassedAndObsoletionStatusSetToAll(slot, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus,
          slotUgFailureBehaviour, RequiredTestResults);
      } else if (!RequiredTestResults) {
        slot = await slotFailureHelper.ugPassedAndNoTestResultsFailureBehaviourShutdown(slot);
      } else if (e2eSlotCompletionDGObsoletionBehaviour === 'off') {
        slot = await slotFailureHelper.ugPassedAndObsoletionStatusSetToOff(slot, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus);
      } else if (e2eSlotCompletionDGObsoletionBehaviour === 'predictions') {
        slot = await slotFailureHelper.ugPassedAndObsoletionStatusSetToPredictions(slot, e2eSlotCompletionDGObsoletionBehaviour,
          bugsAndTRsOnlyStatus, slotUgFailureBehaviour);
      }
    }

    if (failureUpgrade) {
      if (slotUgFailureBehaviour === 'shutdown') {
        slot = await slotFailureHelper.ugFailedAndFailureBehaviourShutdown(slot, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus,
          slotUgFailureBehaviour);
      } else if (slotUgFailureBehaviour === 'obsolete') {
        slot = await slotFailureHelper.ugFailedAndFailureBehaviourObsolete(slot, e2eSlotCompletionDGObsoletionBehaviour,
          bugsAndTRsOnlyStatus, slotUgFailureBehaviour);
      }
    }

    return slot;
  };
}

module.exports = { makeSlotFailure };
