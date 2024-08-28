function makeUgPassedAndObsoletionStatusSetToAll(orchestrateSlotObsoletionPredictions, commonDgObsoletionLogic, sendEmailService,
  switchboardService) {
  return async function ugPassedAndObsoletionStatusSetToAll(slot, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus,
    slotUgFailureBehaviour, RequiredTestResults) {
    let obsoletionAllDGs = '';
    if (RequiredTestResults) {
      const predictedObsoletions = await orchestrateSlotObsoletionPredictions(slot);
      if (predictedObsoletions) {
        slot.deliveredDGs.forEach((deliveryGroup) => {
          const obsoletionInformation = predictedObsoletions.predictions[deliveryGroup.deliveryGroupId];
          if (obsoletionInformation.action === 'Obsolete') {
            obsoletionAllDGs = true;
          }
        });
        if (obsoletionAllDGs) {
          slot = await commonDgObsoletionLogic(predictedObsoletions.updatedSlot, slot.deliveredDGs,
            predictedObsoletions.predictions, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus, slotUgFailureBehaviour, 'success');
        } else {
          await sendEmailService.sendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMail(predictedObsoletions.updatedSlot,
            predictedObsoletions.predictions, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus);
        }
      } else {
        await sendEmailService.sendAmtFailedToMakePredictionsAndShutdownAmtMail(slot);
        await switchboardService.modifySwitchboard({ amtTriggerStatus: 'off', e2eSlotCompletionDGObsoletionBehaviour: 'off', lastModifiedBySignum: 'AMTEL' });
      }
    } else {
      slot = await commonDgObsoletionLogic(slot, slot.deliveredDGs, undefined, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus,
        slotUgFailureBehaviour, 'success');
    }
    return slot;
  };
}

module.exports = { makeUgPassedAndObsoletionStatusSetToAll };
