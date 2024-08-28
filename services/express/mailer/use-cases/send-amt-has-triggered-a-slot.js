function makeSendAmtHasTriggeredASlot(sendEmail) {
  return async function sendAmtHasTriggeredASlot(slot) {
    const emailSubject = 'AMT has triggered a slot';
    const emailRecipient = process.env.EMAIL_RECIPIENT;
    let emailReason = `
    <ul>
      <li>AMT has triggered a new slot:
        <ul>
          <li>Product Set Version: ${slot.productSetVersion}</li>
          <li>pENM: ${slot.physicalEnvironment} | vENM: ${slot.cloudEnvironment}</li>
          <li>Delivery groups:
            <ul>`;
    slot.deliveredDGs.forEach((deliveryGroup) => {
      emailReason += `
              <li>${deliveryGroup.deliveryGroupId}
                <ul>
                  <li>Created by: ${deliveryGroup.createdByTeam}</li>
                  <li>Included Categories: ${deliveryGroup.includedCategories}</li>
                  <li>Type Of Delivery: ${deliveryGroup.typeOfDelivery}</li>
                </ul>
              </li>`;
    });
    emailReason += `
            </ul>
          </li>
        </ul>
      </li>
    </ul>`;
    await sendEmail(emailSubject, emailReason, emailRecipient, true);
  };
}

module.exports = { makeSendAmtHasTriggeredASlot };
