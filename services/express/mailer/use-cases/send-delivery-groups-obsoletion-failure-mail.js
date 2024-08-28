function makeSendDeliveryGroupsObsoletionFailureMail(sendEmail) {
  return async function sendDeliveryGroupsObsoletionFailureMail(deliveryGroupsFailedToObsolete, slot, predictions,
    obsoletionStatus, bugsAndTRsOnlyStatus) {
    const emailSubject = `${slot.productSetVersion} - AMT failed to obsolete DGs, AMT trigger & DG obsoletion switches both turned OFF`;
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
      <li>Delivery groups failed to obsolete:
        <ul>`;
    deliveryGroupsFailedToObsolete.forEach((deliveryGroupFailedToObsolete) => {
      let predictionListItem = '';
      if (predictions !== undefined) {
        const prediction = predictions[deliveryGroupFailedToObsolete.deliveryGroupId];
        predictionListItem = `<li>AMT Prediction: ${prediction.action}</li>`;
      }
      emailReason += `<li>${deliveryGroupFailedToObsolete.deliveryGroupId}
        <ul>
          <li>Created by: ${deliveryGroupFailedToObsolete.createdByTeam}</li>
          <li>Included Categories: ${deliveryGroupFailedToObsolete.includedCategories}</li>
          <li>Type Of Delivery: ${deliveryGroupFailedToObsolete.typeOfDelivery}</li>
          ${predictionListItem}
        </ul>
      </li>`;
    });
    emailReason += `</ul></li></ul>
    <h2 style="color: red; font-size:20px">Please be aware that AMT has been fully switched off due to this failure!</h2>
    <h3 style="color: red; font-size:15px">To turn the AMT switches back on please use the following job:
    <a href="https://${process.env.JENKINS_URL}/jenkins/view/Utilities/job/Utility_AMT_Toggle_Switches/">
    Utility_AMT_Toggle_Switches</a></h3>`;
    await sendEmail(emailSubject, emailReason, emailRecipient, false);
  };
}

module.exports = { makeSendDeliveryGroupsObsoletionFailureMail };
