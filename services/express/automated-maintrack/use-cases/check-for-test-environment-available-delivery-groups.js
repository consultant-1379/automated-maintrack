const logger = require('../../logger/logger');

function makeCheckForTestEnvironmentAvailableDeliveryGroups(deliveryGroupService, failureTrackerService, sendEmailService, switchboardService) {
  return async function checkForTestEnvironmentAvailableDeliveryGroups(failureTracker, emailRecipient, latestDrop, deployPhase, testEnvironments) {
    const queryInfo = 'Action /Unable to trigger AMT slot';
    const loggingTags = { query: queryInfo };
    const NUMBER_OF_DELIVERY_GROUPS = await switchboardService.retrieveNumberOfDeliveryGroups();
    const testEnvironmentAndDeliveryGroups = await deliveryGroupService.findTestEnvironmentQueuedDeliveryGroups(
      NUMBER_OF_DELIVERY_GROUPS, latestDrop, testEnvironments,
    );

    if (testEnvironmentAndDeliveryGroups && testEnvironmentAndDeliveryGroups.queuedDeliveryGroups) {
      if ('error' in testEnvironmentAndDeliveryGroups.queuedDeliveryGroups[0]) {
        await failureTrackerService.addToFailureTracker(failureTracker, testEnvironmentAndDeliveryGroups.queuedDeliveryGroups[0].error, 'upgrade');
        if (await failureTrackerService.checkMaxFailureCountReached(failureTracker, Number(process.env.FAILURE_TRACKER_COUNT))) {
          await sendEmailService.sendTriggerSlotErrorMail('AMT Slot Trigger Failed', failureTracker, emailRecipient);
          await failureTrackerService.resetFailureTracker(failureTracker, deployPhase);
        }
        throw new Error(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups[0].error);
      }
    } else {
      logger.error(loggingTags, 'Delivery Groups was null');
      throw new Error('Delivery Groups was null');
    }

    return testEnvironmentAndDeliveryGroups;
  };
}

module.exports = {
  makeCheckForTestEnvironmentAvailableDeliveryGroups,
};
