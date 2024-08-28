function makeAddToFailureTracker(updateFailureTracker) {
  return async function addToFailureTracker(failureTracker, error, deployPhase) {
    failureTracker.failureCount += 1;
    failureTracker.reasonsForFailure.push(`Attempt ${failureTracker.failureCount}: ${error}`);
    await updateFailureTracker(deployPhase, failureTracker);
  };
}

module.exports = { makeAddToFailureTracker };
