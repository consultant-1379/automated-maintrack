function makeCreateFailureTracker(failureTrackerDb, createFailureTracker) {
  return function addFailureTracker(failureInfo) {
    const failureTracker = createFailureTracker(failureInfo);
    return failureTrackerDb.insert({
      id: failureTracker.getId(),
      deployPhase: failureTracker.getDeployPhase(),
      failureCount: failureTracker.getFailureCount(),
      reasonsForFailure: failureTracker.getFailureReasons(),
      createdOn: failureTracker.getCreatedOn(),
      modifiedOn: failureTracker.getModifiedOn(),
    }, 'failureTrackers');
  };
}

module.exports = { makeCreateFailureTracker };
