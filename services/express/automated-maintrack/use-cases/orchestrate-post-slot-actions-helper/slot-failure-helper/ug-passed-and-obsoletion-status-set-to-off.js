function makeUgPassedAndObsoletionStatusSetToOff(orchestrateSlotObsoletionPredictions, sendEmailService, switchboardService) {
  return async function ugPassedAndObsoletionStatusSetToOff(slot, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus) {
    const predictedObsoletions = await orchestrateSlotObsoletionPredictions(slot);
    if (predictedObsoletions) {
      await sendEmailService.sendAmtHasMadeObsoletionPredictionEmail(predictedObsoletions.updatedSlot, predictedObsoletions.predictions,
        e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus);
      slot = predictedObsoletions.updatedSlot;
    } else {
      await sendEmailService.sendAmtFailedToMakePredictionsAndShutdownAmtMail(slot);
      await switchboardService.modifySwitchboard({ amtTriggerStatus: 'off', e2eSlotCompletionDGObsoletionBehaviour: 'off', lastModifiedBySignum: 'AMTEL' });
    }
    return slot;
  };
}

module.exports = { makeUgPassedAndObsoletionStatusSetToOff };
