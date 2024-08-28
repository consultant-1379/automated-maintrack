module.exports = {
  successEmailTemplate(emailSubject, reasonForSuccess) {
    return `<!DOCTYPE html>

  <html>

  <head>
  </head>

  <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="min-width:100%">
          <tbody>
              <tr>
                  <td style="background-color:#36B07F; padding:20px">
                      <h3 style="color:white; font-size:22px">Automated Maintrack (AMT)</h3>
                      <h4 style="color:white; font-size:18px">${emailSubject}</h4>
                  </td>
              </tr>
              <tr>
                  <td style="background-color:#ededed; padding:20px">
                      <span style="color:black">
                          <p>Hi Maintrack,</p>
                          <p>AMT is notifying you about the recent success:</p>
                          <p>${reasonForSuccess}</p>
                          <p>
                              Kind Regards, <br>
                              AMT
                          </p>
                      </span>
                  </td>
              </tr>
              <tr>
                  <td style="background-color:#0C0C0C; padding:20px">
                      <table>
                          <tr>
                              <td>
                                  <p style="color:#F2F2F2">For questions, comments or suggestions on AMT please contact
                                      <br>
                                      <a href="mailto:BumbleBee.ENM@tcs.com?subject=AMT Notification Mail">ENM/Bumblebee</a>
                                  </p>
                              </td>
                          </tr>
                      </table>

                  </td>
              </tr>
          </tbody>
      </table>
  </body>

  </html>`;
  },
};
