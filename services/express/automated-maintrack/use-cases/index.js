const request = require('superagent');
const { makeTriggerUpgradeParallelSlot } = require('./trigger-upgrade-parallel-slot');
const { makeTriggerUpgradeSequentialSlot } = require('./trigger-upgrade-sequential-slot');
const { makeCheckForTestEnvironmentAvailableDeliveryGroups } = require('./check-for-test-environment-available-delivery-groups');
const { makeCheckForAvailableTestEnvironments } = require('./check-for-available-test-environments');
const { makeCheckForDeliverDeliveryGroups } = require('./check-for-deliver-delivery-groups');
const { makeCheckForOngoingSlots } = require('./check-for-ongoing-slots');
const { makeDeteremineSlotNumber } = require('./determine-slot-number');
const { makeCheckForPendingProductSets } = require('./check-for-pending-product-sets');
const { makeOrchestratePostSlotActions } = require('./orchestrate-post-slot-actions');
const { makePopulateAmtSlotProductSetVersion } = require('./populate-amt-slot-product-set-version');
const { makeAttemptSlotActionIfNoBlockingJob } = require('./attempt-slot-action-if-no-blocking-job');
const { orchestratePostSlotActionsHelper } = require('./orchestrate-post-slot-actions-helper');

const { deliveryGroupService } = require('../../delivery-group/use-cases');
const { failureTrackerService } = require('../../failure-tracker/use-cases');
const { slotService } = require('../../slot/use-cases');
const { switchboardService } = require('../../switchboard/use-cases');
const { testEnvironmentService } = require('../../test-environments/use-cases');
const { sendEmailService } = require('../../mailer/use-cases');
const { jenkinsService } = require('../../jenkins/use-cases');
const { useExternalApiService } = require('../../external-apis');

const checkForTestEnvironmentAvailableDeliveryGroups = makeCheckForTestEnvironmentAvailableDeliveryGroups(deliveryGroupService,
  failureTrackerService, sendEmailService, switchboardService);
const checkForAvailableTestEnvironments = makeCheckForAvailableTestEnvironments(failureTrackerService,
  testEnvironmentService, sendEmailService);
const checkForDeliverDeliveryGroups = makeCheckForDeliverDeliveryGroups(deliveryGroupService, failureTrackerService, sendEmailService);
const checkForOngoingSlots = makeCheckForOngoingSlots(slotService);
const determineSlotNumber = makeDeteremineSlotNumber(slotService, sendEmailService, failureTrackerService);
const checkForPendingProductSets = makeCheckForPendingProductSets(slotService);
const triggerUpgradeParallelSlot = makeTriggerUpgradeParallelSlot(failureTrackerService, slotService, jenkinsService,
  checkForTestEnvironmentAvailableDeliveryGroups, checkForAvailableTestEnvironments, checkForOngoingSlots, checkForPendingProductSets,
  checkForDeliverDeliveryGroups, useExternalApiService, determineSlotNumber, request);
const triggerUpgradeSequentialSlot = makeTriggerUpgradeSequentialSlot(failureTrackerService, slotService, jenkinsService,
  checkForTestEnvironmentAvailableDeliveryGroups, checkForAvailableTestEnvironments,
  checkForOngoingSlots, checkForDeliverDeliveryGroups, useExternalApiService, determineSlotNumber, request);
const orchestratePostSlotActionsFunction = makeOrchestratePostSlotActions(slotService, switchboardService, orchestratePostSlotActionsHelper);
const orchestratePostSlotActions = makeAttemptSlotActionIfNoBlockingJob(orchestratePostSlotActionsFunction, jenkinsService.checkIsJenkinsJobOngoing);
const populateAmtSlotProductSetVersion = makePopulateAmtSlotProductSetVersion(slotService, sendEmailService);

const automatedMaintrackService = Object.freeze({
  triggerUpgradeParallelSlot,
  triggerUpgradeSequentialSlot,
  checkForTestEnvironmentAvailableDeliveryGroups,
  checkForAvailableTestEnvironments,
  checkForDeliverDeliveryGroups,
  checkForOngoingSlots,
  determineSlotNumber,
  checkForPendingProductSets,
  orchestratePostSlotActions,
  orchestratePostSlotActionsFunction,
  populateAmtSlotProductSetVersion,
});

module.exports = {
  automatedMaintrackService,
  triggerUpgradeParallelSlot,
  triggerUpgradeSequentialSlot,
  checkForTestEnvironmentAvailableDeliveryGroups,
  checkForAvailableTestEnvironments,
  checkForDeliverDeliveryGroups,
  checkForOngoingSlots,
  determineSlotNumber,
  checkForPendingProductSets,
  orchestratePostSlotActions,
  orchestratePostSlotActionsFunction,
  populateAmtSlotProductSetVersion,
};
