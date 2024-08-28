function makeSendAmtHasMadeObsoletionPredictionEmail(sendEmail) {
  return async function sendAmtHasMadeObsoletionPredictionEmail(slot, predictions, obsoletionStatus, bugsAndTRsOnlyStatus) {
    const emailSubject = `${slot.productSetVersion} - AMT has predicted DG obsoletions`;
    const emailRecipient = process.env.EMAIL_RECIPIENT;
    let emailReason = `
    <ul>
      <li>Slot Information:
        <ul>
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
          <li>RFA250 Results: <a href="${slot.rfa250Url}">RFA250 Allure Report</a></li>
          <li>ADU Results: <a href="${slot.aduUrl}">ADU Allure Report</a></li>
          <li>APTU Results: <a href="${slot.aptuUrl}">APTU Allure Report</a></li>
        </ul>
      </li>
      <li>Delivery Groups obsoletion predictions:
        <ul>`;
    slot.deliveredDGs.forEach((deliveryGroup) => {
      const obsoletionInformation = predictions[deliveryGroup.deliveryGroupId];
      emailReason += `
        <li>${obsoletionInformation.action}: ${deliveryGroup.deliveryGroupId}
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
    </ul>`;
    await sendEmail(emailSubject, emailReason, emailRecipient, true);
  };
}

module.exports = { makeSendAmtHasMadeObsoletionPredictionEmail };
