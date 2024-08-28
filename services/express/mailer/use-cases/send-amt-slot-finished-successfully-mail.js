function makeSendAmtSlotFinishedSuccessfullyMail(sendEmail) {
  return async function sendAmtSlotFinishedSuccessfullyMail(slot) {
    const emailSubject = `${slot.productSetVersion} - Slot finished successfully, no action needed by AMT`;
    const emailRecipient = process.env.EMAIL_RECIPIENT;
    let emailBody = `
    <ul>
      <li>The following slot has finished successfully:
        <ul>
          <li>Product Set Version: ${slot.productSetVersion}</li>
          <li>pENM: ${slot.physicalEnvironment} | vENM: ${slot.cloudEnvironment}</li>
          <li>Delivery groups:
            <ul>`;
    slot.deliveredDGs.forEach((deliveryGroup) => {
      emailBody += `
              <li>${deliveryGroup.deliveryGroupId}
                <ul>
                  <li>Created by: ${deliveryGroup.createdByTeam}</li>
                  <li>Included Categories: ${deliveryGroup.includedCategories}</li>
                  <li>Type Of Delivery: ${deliveryGroup.typeOfDelivery}</li>
                </ul>
              </li>`;
    });
    emailBody += `
            </ul>
          </li>
        </ul>
      </li>
    </ul>`;
    await sendEmail(emailSubject, emailBody, emailRecipient, true);
  };
}

module.exports = { makeSendAmtSlotFinishedSuccessfullyMail };
