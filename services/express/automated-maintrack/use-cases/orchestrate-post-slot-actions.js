const logger = require('./../../logger/logger');

function makeOrchestratePostSlotActions(slotService, switchboardService, orchestratePostSlotActionsHelper) {
  return async function orchestratePostSlotActions(slotId, slotUpdates) {
    const queryInfo = 'Action /Patch Slot';
    const loggingTags = { query: queryInfo, id: slotId };
    const e2eSlotCompletionDGObsoletionBehaviour = await switchboardService.retrieveE2eSlotCompletionDGObsoletionBehaviour();
    const bugsAndTRsOnlyStatus = await switchboardService.retrieveBugsAndTRsOnlyStatus();
    const slotUgFailureBehaviour = await switchboardService.retrieveSlotUgFailureBehaviour();
    logger.debug(loggingTags, `e2eSlotCompletionDGObsoletionBehaviour = ${e2eSlotCompletionDGObsoletionBehaviour},
    bugsAndTRsOnlyStatus = ${bugsAndTRsOnlyStatus},
    slotUgFailureBehaviour = ${slotUgFailureBehaviour}`);
    let patchedSlot = await slotService.updateSlot({ id: slotId, ...slotUpdates });

    if (patchedSlot.slotStatus === 'success') {
      patchedSlot = await orchestratePostSlotActionsHelper.slotSuccessful(patchedSlot);
    } else if (patchedSlot.slotStatus === 'ongoing' || patchedSlot.deliveredDGs.length <= 0) {
      patchedSlot = await orchestratePostSlotActionsHelper.slotOngoingOrNoDeliveryGroups(patchedSlot);
    } else if (patchedSlot.slotStatus === 'failure') {
      patchedSlot = await orchestratePostSlotActionsHelper.slotFailure(patchedSlot);
    }
    logger.debug(loggingTags, `patchSlot = ${JSON.stringify(patchedSlot)}`);
    return patchedSlot;
  };
}

module.exports = { makeOrchestratePostSlotActions };
