function makeSendTriggerSlotErrorMail(sendEmail) {
  return function sendTriggerSlotErrorMail(emailSubject, failureTracker, recipients) {
    let emailReason = '';
    emailReason = failureTracker.reasonsForFailure.join('<br>');
    sendEmail(emailSubject, emailReason, recipients, false);
  };
}

module.exports = { makeSendTriggerSlotErrorMail };
