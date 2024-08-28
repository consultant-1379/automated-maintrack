const logger = require('./../../logger/logger');

function makeCheckForAvailableTestEnvironments(failureTrackerService, testEnvironmentService, sendEmailService) {
  return async function checkForAvailableTestEnvironments(failureTracker, emailRecipient, deployPhase) {
    let testEnvironmentError = '';
    const queryInfo = 'Action /Unable to trigger AMT slot';
    const loggingTags = { query: queryInfo };
    const physicalTestEnvironments = await testEnvironmentService.retrieveCandidatePhysicalEnvironments('IDLE', 'MTE', 'latest');
    const cloudTestEnvironment = await testEnvironmentService.retrieveCandidateVenmEnvironment('IDLE', 'MTE', 'oldest');
    if (!physicalTestEnvironments || (!physicalTestEnvironments.candidatePhysicalVersioningTestEnvironment.name
      && !physicalTestEnvironments.candidatePhysicalAutTestEnvironment.name && !physicalTestEnvironments.candidatePhysicalEvtsTestEnvironment.name)) {
      testEnvironmentError += 'There are no physical IDLE MTE test environments that are SHC completed in EMT at this time. ';
    }
    if (!cloudTestEnvironment || !cloudTestEnvironment.candidateEnvironmentName) {
      testEnvironmentError += 'There are no cloud IDLE MTE test environments that are SHC completed in EMT at this time.';
    }
    if (testEnvironmentError) {
      await failureTrackerService.addToFailureTracker(failureTracker, testEnvironmentError, 'upgrade');
      if (await failureTrackerService.checkMaxFailureCountReached(failureTracker, Number(process.env.FAILURE_TRACKER_COUNT))) {
        logger.error(loggingTags, testEnvironmentError);
        await sendEmailService.sendTriggerSlotErrorMail('AMT Slot Trigger Failed', failureTracker, emailRecipient);
        await failureTrackerService.resetFailureTracker(failureTracker, deployPhase);
      }
      throw new Error(testEnvironmentError);
    }
    return {
      candidatePhysicalVersioningTestEnvironment: physicalTestEnvironments.candidatePhysicalVersioningTestEnvironment,
      candidatePhysicalAutTestEnvironment: physicalTestEnvironments.candidatePhysicalAutTestEnvironment,
      candidatePhysicalEvtsTestEnvironment: physicalTestEnvironments.candidatePhysicalEvtsTestEnvironment,
      candidateCloudTestEnvironmentName: cloudTestEnvironment.candidateEnvironmentName,
    };
  };
}

module.exports = {
  makeCheckForAvailableTestEnvironments,
};
