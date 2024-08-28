const { switchboardService } = require('../../switchboard/use-cases');

function makeCreateSlot(slotDb, createSlot) {
  return async function addSlot(slotInfo) {
    slotInfo.bugsAndTRsOnlyStatus = await switchboardService.retrieveBugsAndTRsOnlyStatus();
    slotInfo.slotUgFailureBehaviour = await switchboardService.retrieveSlotUgFailureBehaviour();
    const slot = createSlot(slotInfo);
    return slotDb.insert({
      id: slot.getId(),
      physicalEnvironment: slot.getPhysicalEnvironment(),
      cloudEnvironment: slot.getCloudEnvironment(),
      deliveredDGs: slot.getDeliveredDGs(),
      obsoletedDGs: slot.getObsoletedDGs(),
      dgObsoletionPredictions: slot.getDgObsoletionPredictions(),
      bugsAndTRsOnlyStatus: slot.getBugsAndTRsOnlyStatus(),
      slotUgFailureBehaviour: slot.getSlotUgFailureBehaviour(),
      slotStatus: slot.getSlotStatus(),
      physicalStatus: slot.getPhysicalStatus(),
      cloudStatus: slot.getCloudStatus(),
      physicalUpgradeStatus: slot.getPhysicalUpgradeStatus(),
      cloudUpgradeStatus: slot.getCloudUpgradeStatus(),
      physicalFailedJobUrl: slot.getPhysicalFailedJobUrl(),
      cloudFailedJobUrl: slot.getCloudFailedJobUrl(),
      productSetVersion: slot.getProductSetVersion(),
      slotType: slot.getSlotType(),
      rfa250Url: slot.getRfa250Url(),
      aptuUrl: slot.getAptuUrl(),
      aduUrl: slot.getAduUrl(),
      createdOn: slot.getCreatedOn(),
      modifiedOn: slot.getModifiedOn(),
      slotNumber: slot.getSlotNumber(),
    }, 'slots');
  };
}

module.exports = { makeCreateSlot };
