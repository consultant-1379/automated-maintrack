function makeSendAllDeliveryGroupsObsoletedSuccessMail(sendEmail) {
  return async function sendAllDeliveryGroupsObsoletedSuccessMail(obsoletedDeliveryGroups, slot, predictions,
    obsoletionStatus, bugsAndTRsOnlyStatus, slotUgFailureBehaviour) {
    const emailSubject = `${slot.productSetVersion} - AMT has completed non-prediction-based obsoletions of all DGs`;
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
      <li>Slot Ug Failure Behaviour:
        <span style="text-transform: capitalize;">${slotUgFailureBehaviour}</span>
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
      <li>Delivery groups successfully obsoleted:
        <ul>`;
    obsoletedDeliveryGroups.forEach((obsoletedDeliveryGroup) => {
      let predictionListItem = '';
      if (predictions !== undefined) {
        const prediction = predictions[obsoletedDeliveryGroup.deliveryGroupId];
        predictionListItem = `<li>AMT Prediction: ${prediction.action}</li>`;
      }
      emailReason += `
          <li>${obsoletedDeliveryGroup.deliveryGroupId}
            <ul>
              <li>Created by: ${obsoletedDeliveryGroup.createdByTeam}</li>
              <li>Included Categories: ${obsoletedDeliveryGroup.includedCategories}</li>
              <li>Type Of Delivery: ${obsoletedDeliveryGroup.typeOfDelivery}</li>
              ${predictionListItem}
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

module.exports = { makeSendAllDeliveryGroupsObsoletedSuccessMail };
