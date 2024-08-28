function makeCommonDgObsoletionLogic(sendEmailService, deliveryGroupService, slotService, switchboardService) {
  return async function commonDgObsoletionLogic(slot, deliveryGroupsToObsolete, predictedObsoletions,
    e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus, slotUgFailureBehaviour, upgradeStatus) {
    const productSetVersion = slot.productSetVersion.split('.');
    const drop = `${productSetVersion[0]}.${productSetVersion[1]}`;
    const allObsoletedDeliveryGroups = await deliveryGroupService.obsoleteDeliveryGroups(drop, deliveryGroupsToObsolete);
    if (allObsoletedDeliveryGroups.obsoletedDeliveryGroups.length > 0) {
      slot = await slotService.updateSlot({ id: slot.id, obsoletedDGs: allObsoletedDeliveryGroups.obsoletedDeliveryGroups });
      if (upgradeStatus === 'failure') {
        await sendEmailService.sendUpgradeFailureAndAllDeliveryGroupsObsoletedSuccessMail(allObsoletedDeliveryGroups.obsoletedDeliveryGroups,
          slot, predictedObsoletions, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus, slotUgFailureBehaviour);
      } else if (e2eSlotCompletionDGObsoletionBehaviour === 'all') {
        await sendEmailService.sendAllDeliveryGroupsObsoletedSuccessMail(allObsoletedDeliveryGroups.obsoletedDeliveryGroups,
          slot, predictedObsoletions, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus, slotUgFailureBehaviour);
      } else if (e2eSlotCompletionDGObsoletionBehaviour === 'predictions') {
        await sendEmailService.sendPredictedDeliveryGroupsObsoletedMail(allObsoletedDeliveryGroups.obsoletedDeliveryGroups, slot,
          e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus);
      }
    }
    if (allObsoletedDeliveryGroups.deliveryGroupsFailedToObsolete.length > 0) {
      await sendEmailService.sendDeliveryGroupsObsoletionFailureMail(allObsoletedDeliveryGroups.deliveryGroupsFailedToObsolete, slot,
        predictedObsoletions, e2eSlotCompletionDGObsoletionBehaviour, bugsAndTRsOnlyStatus);
      await switchboardService.modifySwitchboard({ amtTriggerStatus: 'off', e2eSlotCompletionDGObsoletionBehaviour: 'off', lastModifiedBySignum: 'AMTEL' });
    }
    return slot;
  };
}

module.exports = { makeCommonDgObsoletionLogic };
