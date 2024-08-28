function makeSendUpgradeFailureMail(sendEmail) {
  return async function sendUpgradeFailureMail(slot, obsoletionStatus, bugsAndTRsOnlyStatus, slotUgFailureBehaviour) {
    const emailSubject = `${slot.productSetVersion} - UG Job(s) Failed, AMT trigger switch turned OFF`;
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
    </ul>
    <h2 style="color: red; font-size:20px">Please be aware that AMT has been fully switched off due to this failure 
    and slotUgFailureBehaviour is set to shutdown!</h2>
    <h3 style="color: red; font-size:15px">To turn the AMT switches back on please use the following job:
      <a href="https://${process.env.JENKINS_URL}/jenkins/view/Utilities/job/Utility_AMT_Toggle_Switches/">Utility_AMT_Toggle_Switches</a>
    </h3>`;
    await sendEmail(emailSubject, emailReason, emailRecipient, false);
  };
}

module.exports = { makeSendUpgradeFailureMail };
