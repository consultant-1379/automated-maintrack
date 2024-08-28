function makeUgPassedAndNoTestResultsFailureBehaviourShutdown(sendEmailService, switchboardService) {
  return async function ugPassedAndNoTestResultsFailureBehaviourShutdown(slot) {
    await sendEmailService.sendAmtUnableToMakePredictionsAndShutdownAmtMail(slot);
    await switchboardService.modifySwitchboard({ amtTriggerStatus: 'off', lastModifiedBySignum: 'AMTEL' });
    return slot;
  };
}

module.exports = { makeUgPassedAndNoTestResultsFailureBehaviourShutdown };
