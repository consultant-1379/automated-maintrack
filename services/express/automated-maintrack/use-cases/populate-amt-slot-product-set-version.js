function makePopulateAmtSlotProductSetVersion(slotService, sendEmailService) {
  return async function populateAmtSlotProductSetVersion(slotId, slotUpdates) {
    const { productSetVersion } = slotUpdates;
    const patchedSlot = await slotService.updateSlot({ id: slotId, productSetVersion });
    await sendEmailService.sendAmtHasTriggeredASlot(patchedSlot);
    return patchedSlot;
  };
}

module.exports = { makePopulateAmtSlotProductSetVersion };
