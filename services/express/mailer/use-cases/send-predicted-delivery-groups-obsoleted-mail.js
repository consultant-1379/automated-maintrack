function makeSendPredictedDeliveryGroupsObsoletedMail(sendEmail) {
  return async function sendPredictedDeliveryGroupsObsoletedMail(obsoletedDeliveryGroups, slot, obsoletionStatus, bugsAndTRsOnlyStatus) {
    const emailSubject = `${slot.productSetVersion} - AMT has completed prediction-based obsoletions`;
    const emailRecipient = process.env.EMAIL_RECIPIENT;
    let emailReason = `
    <ul>
      <li>Product Set Version: ${slot.productSetVersion}</li>
      <li>pENM: ${slot.physicalEnvironment} | vENM: ${slot.cloudEnvironment}</li>
      <li>
        pENM Slot Status: 
        <span style="text-transform: capitalize;">${slot.physicalStatus}</span>
          | vENM Slot Status: 
        <span style="text-transform: capitalize;">${slot.cloudStatus}</span>
      </li>
      <li>DG Obsoletion Switch Status: 
        <span style="text-transform: capitalize;">${obsoletionStatus}</span>
      </li>
      <li>Bugs and TRs Only Switch Status:
        <span style="text-transform: capitalize;">${bugsAndTRsOnlyStatus}</span>
      </li>
      <li>Delivery groups successfully obsoleted:
        <ul>`;
    obsoletedDeliveryGroups.forEach((obsoletedDeliveryGroup) => {
      emailReason += `
          <li>${obsoletedDeliveryGroup.deliveryGroupId}
            <ul>
              <li>Created by: ${obsoletedDeliveryGroup.createdByTeam}</li>
              <li>Included Categories: ${obsoletedDeliveryGroup.includedCategories}</li>
              <li>Type Of Delivery: ${obsoletedDeliveryGroup.typeOfDelivery}</li>
            </ul>
          </li>`;
    });
    emailReason += `
        </ul>
      </li>
    </ul>`;
    await sendEmail(emailSubject, emailReason, emailRecipient, true);
  };
}

module.exports = { makeSendPredictedDeliveryGroupsObsoletedMail };
