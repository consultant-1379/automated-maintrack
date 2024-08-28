function makeUpdateSlot(slotDb, createSlot) {
  return async function updateSlot({ id, ...changes }) {
    if (!id) {
      throw new Error('You must supply an id');
    }

    const existingSlot = await slotDb.findById(id, 'slots');

    if (!existingSlot) {
      throw new Error('Slot not found');
    }

    const updatedSlotProperties = { ...existingSlot[0], ...changes, modifiedOn: undefined };

    if (![updatedSlotProperties.cloudStatus, updatedSlotProperties.physicalStatus].includes('ongoing')) {
      if ([updatedSlotProperties.cloudStatus, updatedSlotProperties.physicalStatus].indexOf('failure') >= 0) {
        updatedSlotProperties.slotStatus = 'failure';
      } else {
        updatedSlotProperties.slotStatus = 'success';
      }
    }

    const updatedSlot = createSlot(updatedSlotProperties);

    const updated = await slotDb.update({
      id: updatedSlot.getId(),
      physicalEnvironment: updatedSlot.getPhysicalEnvironment(),
      cloudEnvironment: updatedSlot.getCloudEnvironment(),
      deliveredDGs: updatedSlot.getDeliveredDGs(),
      obsoletedDGs: updatedSlot.getObsoletedDGs(),
      dgObsoletionPredictions: updatedSlot.getDgObsoletionPredictions(),
      bugsAndTRsOnlyStatus: updatedSlot.getBugsAndTRsOnlyStatus(),
      slotUgFailureBehaviour: updatedSlot.getSlotUgFailureBehaviour(),
      slotStatus: updatedSlot.getSlotStatus(),
      physicalStatus: updatedSlot.getPhysicalStatus(),
      cloudStatus: updatedSlot.getCloudStatus(),
      physicalUpgradeStatus: updatedSlot.getPhysicalUpgradeStatus(),
      cloudUpgradeStatus: updatedSlot.getCloudUpgradeStatus(),
      physicalFailedJobUrl: updatedSlot.getPhysicalFailedJobUrl(),
      cloudFailedJobUrl: updatedSlot.getCloudFailedJobUrl(),
      productSetVersion: updatedSlot.getProductSetVersion(),
      slotType: updatedSlot.getSlotType(),
      rfa250Url: updatedSlot.getRfa250Url(),
      aptuUrl: updatedSlot.getAptuUrl(),
      aduUrl: updatedSlot.getAduUrl(),
      createdOn: updatedSlot.getCreatedOn(),
      modifiedOn: updatedSlot.getModifiedOn(),
      slotNumber: updatedSlot.getSlotNumber(),
    }, 'slots');

    if (!updated) {
      return existingSlot;
    }

    return updated;
  };
}

module.exports = { makeUpdateSlot };
