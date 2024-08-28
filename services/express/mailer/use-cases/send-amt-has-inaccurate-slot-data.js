function makeSendAmtHasInaccurateSlotData(sendEmail) {
  return async function sendAmtHasInaccurateSlotData(slot) {
    const emailSubject = 'AMT has automatically cleaned up dangling slots to avoid slot trigger issues.';
    const emailRecipient = process.env.EMAIL_RECIPIENT;
    let emailReason = `
    <ul>
      <li>AMT has updated the below slot to failed
        <ul>
          <li>Product Set Version: ${slot.productSetVersion}</li>
          <li>pENM: ${slot.physicalEnvironment} | vENM: ${slot.cloudEnvironment}</li>
          <li>
            pENM Slot Status:
            <span style="text-transform: capitalize;">${slot.physicalStatus}</span>
            | vENM Slot Status:
            <span style="text-transform: capitalize;">${slot.cloudStatus}</span>
            | Overall Slot Status:
            <span style="text-transform: capitalize;">${slot.slotStatus}</span>
          </li>`;
    if (slot.cloudFailedJobUrl) {
      emailReason += `
        <li> Cloud Failed Job URL:
          <a href="${slot.cloudFailedJobUrl}">Jenkins URL</a>
        </li>`;
    }
    if (slot.physicalFailedJobUrl) {
      emailReason += `
        <li> Physical Failed Job URL:
          <a href="${slot.physicalFailedJobUrl}">Jenkins URL</a>
        </li>`;
    }
    emailReason += `
        </ul>
      </li>
    </ul>`;
    await sendEmail(emailSubject, emailReason, emailRecipient, false);
  };
}

module.exports = { makeSendAmtHasInaccurateSlotData };
