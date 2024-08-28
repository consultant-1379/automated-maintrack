function makeSendTriggerSlotCoupleErrorMail(sendEmail) {
  return async function sendTriggerSlotCoupleErrorMail() {
    const emailSubject = 'AMT Slot Trigger Failed.';
    const emailRecipient = process.env.EMAIL_RECIPIENT;
    const emailReason = `
    <ul>
      <li>AMT has Failed to Trigger a Slot
        <ul>
          <li>The first slot is still ongoing in the slot copuple, therefore cannot kick off slot.</li>
      </li>
    </ul>`;
    await sendEmail(emailSubject, emailReason, emailRecipient, false);
  };
}

module.exports = { makeSendTriggerSlotCoupleErrorMail };
