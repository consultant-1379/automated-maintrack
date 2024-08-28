const { exec } = require('child_process');
const fileSystem = require('fs');
const { buildSendEmail } = require('./send-email');
const { makeSendTriggerSlotErrorMail } = require('./send-trigger-slot-error-mail');
const { makeSendTriggerSlotCoupleErrorMail } = require('./send-trigger-slot-couple-error-mail');
const { makeSendAllDeliveryGroupsObsoletedSuccessMail } = require('./send-all-delivery-groups-obsoleted-success-mail');
const { makeSendDeliveryGroupsObsoletionFailureMail } = require('./send-delivery-groups-obsoletion-failure-mail');
const { makeSendAmtSlotFinishedSuccessfullyMail } = require('./send-amt-slot-finished-successfully-mail');
const { makeSendAmtHasMadeObsoletionPredictionEmail } = require('./send-amt-has-made-obsoletion-prediction');
const { makeSendAmtHasTriggeredASlot } = require('./send-amt-has-triggered-a-slot');
const { makeSendAmtHasInaccurateSlotData } = require('./send-amt-has-inaccurate-slot-data');
const { makeSendAmtUnableToMakePredictions } = require('./send-amt-unable-to-make-predictions');
const { makeSendPredictedDeliveryGroupsObsoletedMail } = require('./send-predicted-delivery-groups-obsoleted-mail');
const { makeSendUpgradeFailureMail } = require('./send-upgrade-failure-mail');
const { makeUpgradeFailureAndSendAllDeliveryGroupsObsoletedSuccessMail } = require('./send-upgrade-failure-and-delivery-groups-obsoleted-success-mail');
const { makeSendAmtUnableToMakePredictionsAndShutdownAmtMail } = require('./send-amt-unable-to-make-predictions-and-shutdown-amt-mail');
const { makeSendAmtFailedToMakePredictionsAndShutdownAmtMail } = require('./send-amt-failed-to-make-predictions-and-shutdown-amt-mail');
const { makeSendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMail } = require('./send-amt-has-made-obsoletion-prediction-and-no-obsoletions-mail');
const failureEmail = require('../templates/failure-template');
const successEmail = require('../templates/success-template');

const sendEmail = buildSendEmail({
  exec, fileSystem, successEmail, failureEmail,
});

const sendTriggerSlotErrorMail = makeSendTriggerSlotErrorMail(sendEmail);
const sendTriggerSlotCoupleErrorMail = makeSendTriggerSlotCoupleErrorMail(sendEmail);
const sendAllDeliveryGroupsObsoletedSuccessMail = makeSendAllDeliveryGroupsObsoletedSuccessMail(sendEmail);
const sendDeliveryGroupsObsoletionFailureMail = makeSendDeliveryGroupsObsoletionFailureMail(sendEmail);
const sendAmtSlotFinishedSuccessfullyMail = makeSendAmtSlotFinishedSuccessfullyMail(sendEmail);
const sendAmtHasMadeObsoletionPredictionEmail = makeSendAmtHasMadeObsoletionPredictionEmail(sendEmail);
const sendAmtHasInaccurateSlotData = makeSendAmtHasInaccurateSlotData(sendEmail);
const sendAmtUnableToMakePredictions = makeSendAmtUnableToMakePredictions(sendEmail);
const sendAmtHasTriggeredASlot = makeSendAmtHasTriggeredASlot(sendEmail);
const sendPredictedDeliveryGroupsObsoletedMail = makeSendPredictedDeliveryGroupsObsoletedMail(sendEmail);
const sendUpgradeFailureMail = makeSendUpgradeFailureMail(sendEmail);
const sendAmtUnableToMakePredictionsAndShutdownAmtMail = makeSendAmtUnableToMakePredictionsAndShutdownAmtMail(sendEmail);
const sendAmtFailedToMakePredictionsAndShutdownAmtMail = makeSendAmtFailedToMakePredictionsAndShutdownAmtMail(sendEmail);
const sendUpgradeFailureAndAllDeliveryGroupsObsoletedSuccessMail = makeUpgradeFailureAndSendAllDeliveryGroupsObsoletedSuccessMail(sendEmail);
const sendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMail = makeSendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMail(sendEmail);

const sendEmailService = Object.freeze({
  sendEmail,
  sendTriggerSlotErrorMail,
  sendTriggerSlotCoupleErrorMail,
  sendAllDeliveryGroupsObsoletedSuccessMail,
  sendDeliveryGroupsObsoletionFailureMail,
  sendAmtSlotFinishedSuccessfullyMail,
  sendAmtHasMadeObsoletionPredictionEmail,
  sendAmtHasTriggeredASlot,
  sendAmtHasInaccurateSlotData,
  sendAmtUnableToMakePredictions,
  sendPredictedDeliveryGroupsObsoletedMail,
  sendUpgradeFailureMail,
  sendAmtUnableToMakePredictionsAndShutdownAmtMail,
  sendAmtFailedToMakePredictionsAndShutdownAmtMail,
  sendUpgradeFailureAndAllDeliveryGroupsObsoletedSuccessMail,
  sendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMail,
});

module.exports = {
  sendEmailService,
  sendEmail,
  sendTriggerSlotErrorMail,
  sendTriggerSlotCoupleErrorMail,
  sendAllDeliveryGroupsObsoletedSuccessMail,
  sendDeliveryGroupsObsoletionFailureMail,
  sendAmtHasMadeObsoletionPredictionEmail,
  sendAmtHasTriggeredASlot,
  sendAmtHasInaccurateSlotData,
  sendAmtUnableToMakePredictions,
  sendPredictedDeliveryGroupsObsoletedMail,
  sendUpgradeFailureMail,
  sendAmtUnableToMakePredictionsAndShutdownAmtMail,
  sendAmtFailedToMakePredictionsAndShutdownAmtMail,
  sendUpgradeFailureAndAllDeliveryGroupsObsoletedSuccessMail,
  sendAmtHasMadeObsoletionPredictionAndNoObsoletionsRequiredMail,
};
