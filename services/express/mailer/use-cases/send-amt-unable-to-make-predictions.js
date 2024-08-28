function makeSendAmtUnableToMakePredictions(sendEmail) {
  return async function sendAmtUnableToMakePredictions(slot) {
    const emailSubject = `${slot.productSetVersion} - AMT was unable to make predictions`;
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
          </li>
          <li> AMT was unable to make predictions because: 
            <ul>`;
    if (!slot.rfa250Url) {
      emailReason += `
              <li> Slot does not contain RFA250 Allure Report url</li>`;
    }
    if (!slot.aduUrl) {
      emailReason += `
              <li> Slot does not contain ADU Allure Report url</li>`;
    }
    if (!slot.aptuUrl) {
      emailReason += `
              <li> Slot does not contain APTU Allure Report url</li>`;
    }
    emailReason += `
            </ul>
          </li>
        </ul>
      </li>
    </ul>`;
    await sendEmail(emailSubject, emailReason, emailRecipient, false);
  };
}

module.exports = { makeSendAmtUnableToMakePredictions };
