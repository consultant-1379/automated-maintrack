function makeTriggerUpgradeParallelSlot(
  failureTrackerService, slotService, jenkinsService, checkForTestEnvironmentAvailableDeliveryGroups,
  checkForAvailableTestEnvironments, checkForOngoingSlots, checkForPendingProductSets,
  checkForDeliverDeliveryGroups, useExternalApiService, determineSlotNumber, request,
) {
  return async function triggerUpgradeParallelSlot() {
    const upgradeDeployPhase = 'upgrade';
    const maximumNumberOfRunningSlots = 2;
    const amtUrl = 'http://amt.athtem.eei.ericsson.se';
    let failureTracker = {};
    let testEnvironments = {};
    let fullSlotListBody = {};
    let testEnvironmentAndDeliveryGroups = {};
    let deliveredDeliveryGroups = {};
    const emailRecipient = process.env.EMAIL_RECIPIENT;
    const amtMasterJob = process.env.AMT_MASTER_JOB;
    const existingFailureTracker = await failureTrackerService.listFailureTracker(upgradeDeployPhase);
    if (!existingFailureTracker) {
      failureTracker = await failureTrackerService.createNewFailureTracker(
        { deployPhase: upgradeDeployPhase, failureCount: 0, reasonsForFailure: [] },
      );
    } else {
      failureTracker = existingFailureTracker;
    }

    const latestDrop = await useExternalApiService.useExternalApi.getLatestDrop();
    await checkForOngoingSlots(maximumNumberOfRunningSlots);
    await checkForPendingProductSets();
    await request.get(`${amtUrl}/api/slots/?format=json`)
      .then((fullSlotList) => {
        fullSlotListBody = fullSlotList.body;
      }).catch((err) => {
        throw new Error(err);
      });
    const newSlotNumber = await determineSlotNumber(fullSlotListBody, failureTracker);
    testEnvironments = await checkForAvailableTestEnvironments(failureTracker, emailRecipient, upgradeDeployPhase);
    testEnvironmentAndDeliveryGroups = await checkForTestEnvironmentAvailableDeliveryGroups(
      failureTracker, emailRecipient, latestDrop, upgradeDeployPhase, testEnvironments,
    );

    deliveredDeliveryGroups = await checkForDeliverDeliveryGroups(
      failureTracker, emailRecipient, testEnvironmentAndDeliveryGroups.queuedDeliveryGroups,
    );

    const slotData = {
      slotStatus: 'ongoing',
      deliveredDGs: deliveredDeliveryGroups,
      productSetVersion: 'pending',
      physicalEnvironment: testEnvironmentAndDeliveryGroups.testEnvironment.name,
      physicalStatus: 'ongoing',
      cloudEnvironment: testEnvironments.candidateCloudTestEnvironmentName,
      cloudStatus: 'ongoing',
      slotType: 'automatic',
      slotNumber: newSlotNumber,
    };
    await slotService.createNewSlot(slotData);
    const jobParams = {
      cluster_id: testEnvironmentAndDeliveryGroups.testEnvironment.name,
      venm_functional_hostname: testEnvironments.candidateCloudTestEnvironmentName,
      drop: latestDrop,
    };
    await jenkinsService.buildJenkinsJob(amtMasterJob, jobParams);
    await failureTrackerService.resetFailureTracker(failureTracker, upgradeDeployPhase);
  };
}

module.exports = {
  makeTriggerUpgradeParallelSlot,
};
