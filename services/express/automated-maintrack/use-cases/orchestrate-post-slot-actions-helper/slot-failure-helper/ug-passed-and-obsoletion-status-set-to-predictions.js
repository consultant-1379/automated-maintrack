function makeUgPassedAndObsoletionStatusSetToPredictions(orchestrateSlotObsoletionPredictions, commonDgObsoletionLogic,
  sendEmailService, switchboardService) {
  return async function ugPassedAndObsoletionStatusSetToPredictions(slot, e2eSlotCompletionDGObsoletionBehaviour,
    bugsAndTRsOnlyStatus, slotUgFailureBehaviour) {
    const predictedObsoletions = await orchestrateSlotObsoletionPredictions(slot);

    const deliveryGroupsToObsolete = [];
    if (predictedObsoletions) {
      slot.deliveredDGs.forEach((deliveryGroup) => {
        const obsoletionInformation = predictedObsoletions.predictions[deliveryGroup.deliveryGroupId];
        if (obsoletionInformation.action === 'Obsolete') {
          deliveryGroupsToObsolete.push(deliveryGroup);
        }
      });
      if (deliveryGroupsToObsolete.length <= 0) {
        await sendEmailService.sendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMail(predictedObsoletions.updatedSlot,
          predictedObsoletions.predictions, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus);
      } else {
        slot = await commonDgObsoletionLogic(predictedObsoletions.updatedSlot, deliveryGroupsToObsolete, predictedObsoletions,
          e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus, slotUgFailureBehaviour, 'success');
      }
    } else {
      await sendEmailService.sendAmtFailedToMakePredictionsAndShutdownAmtMail(slot);
      await switchboardService.modifySwitchboard({ amtTriggerStatus: 'off', e2eSlotCompletionDGObsoletionBehaviour: 'off', lastModifiedBySignum: 'AMTEL' });
    }
    return slot;
  };
}

module.exports = { makeUgPassedAndObsoletionStatusSetToPredictions };
