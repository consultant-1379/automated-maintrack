function makeSlotSuccessful(sendEmailService) {
  return async function slotSuccessful(slot) {
    await sendEmailService.sendAmtSlotFinishedSuccessfullyMail(slot);
    return slot;
  };
}

module.exports = { makeSlotSuccessful };
