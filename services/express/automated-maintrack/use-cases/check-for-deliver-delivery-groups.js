function makeCheckForDeliverDeliveryGroups(deliveryGroupService, failureTrackerService, sendEmailService) {
  return async function checkForDeliverDeliveryGroups(failureTracker, emailRecipient, deliveryGroups) {
    let numberOfFailedDeliveryGroups = 0;

    if (!deliveryGroups || deliveryGroups.length === 0) {
      throw new Error('You must pass in one or more delivery group(s).');
    }

    const deliveredDeliveryGroupsStatuses = await deliveryGroupService.deliverDeliveryGroups(deliveryGroups);

    if (!deliveredDeliveryGroupsStatuses || deliveredDeliveryGroupsStatuses.length === 0) {
      throw new Error('No valid delivered delivery group(s) returned.');
    }

    deliveredDeliveryGroupsStatuses.forEach((deliveredDeliveryGroup) => {
      if (deliveredDeliveryGroup.statusCode === 500) {
        numberOfFailedDeliveryGroups += 1;
        deliveryGroups = deliveryGroups.filter(item => item.deliveryGroupId !== deliveredDeliveryGroup.deliveryGroupId);
      }
    });

    if (numberOfFailedDeliveryGroups === deliveredDeliveryGroupsStatuses.length) {
      await failureTrackerService.addToFailureTracker(failureTracker, 'All Delivery Groups failed to automatically deliver', 'upgrade');
      if (await failureTrackerService.checkMaxFailureCountReached(failureTracker, Number(process.env.FAILURE_TRACKER_COUNT))) {
        await sendEmailService.sendTriggerSlotErrorMail('AMT Slot Trigger Failed', failureTracker, emailRecipient);
      }
      throw new Error('All Delivery Groups failed to automatically deliver.');
    }

    return deliveryGroups;
  };
}

module.exports = {
  makeCheckForDeliverDeliveryGroups,
};
