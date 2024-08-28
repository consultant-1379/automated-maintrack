function makeSendAmtUnableToMakePredictionsAndShutdownAmtMail(sendEmail) {
  return async function sendAmtUnableToMakePredictionsAndShutdownAmtMail(slot) {
    const emailSubject = `${slot.productSetVersion} - AMT was unable to make predictions, AMT trigger switch turned OFF`;
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
    </ul>
    <h2 style="color: red; font-size:20px">Please be aware that AMT has been fully switched off due to this failure</h2>
    <h3 style="color: red; font-size:15px">To turn the AMT switches back on please use the following job:
      <a href="https://${process.env.JENKINS_URL}/jenkins/view/Utilities/job/Utility_AMT_Toggle_Switches/">Utility_AMT_Toggle_Switches</a>
    </h3>`;
    await sendEmail(emailSubject, emailReason, emailRecipient, false);
  };
}

module.exports = { makeSendAmtUnableToMakePredictionsAndShutdownAmtMail };
