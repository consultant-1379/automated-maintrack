function buildSendEmail({
  exec, fileSystem, successEmail, failureEmail,
}) {
  return async function sendEmail(emailSubject, reason, recipients, successfulResult) {
    const emailBody = successfulResult
      ? successEmail.successEmailTemplate(emailSubject, reason) : failureEmail.failureEmailTemplate(emailSubject, reason);
    if (process.env.NODE_ENV !== 'PROD') {
      emailSubject = `${process.env.NODE_ENV} ENV: ${emailSubject}`;
    }

    fileSystem.writeFile('./email-content.html', emailBody, (err) => {
      if (err) console.log('ERROR: Issue writing to HTML file for email: ', err);
    });
    return new Promise((resolve) => {
      exec(`python ./mailer/resources/send_email.py -s "${emailSubject}" -r "${recipients}"`, (error, stdout, stderr) => {
        if (error) {
          throw new Error(error);
        }
        resolve(stdout || stderr);
      });
    });
  };
}

module.exports = { buildSendEmail };
