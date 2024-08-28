function makeResetFailureTracker(modifyFailureTracker) {
  return async function resetFailureTracker(failureTracker, deployPhase) {
    failureTracker.failureCount = 0;
    failureTracker.reasonsForFailure = [];
    await modifyFailureTracker(deployPhase, failureTracker);
  };
}

module.exports = { makeResetFailureTracker };
