function makeUpdateFailureTracker(failureTrackerDb, createFailureTracker, listFailureTracker) {
  return async function updateFailureTracker(deployPhase, failureTrackerChanges) {
    if (!deployPhase) {
      throw new Error('You must specify a deploy phase.');
    }
    if (!['upgrade', 'install'].includes(deployPhase)) {
      throw new Error('You must use either upgrade or install for the deploy phase value.');
    }

    const existingFailureTracker = await listFailureTracker(deployPhase);

    if (!existingFailureTracker) {
      throw new Error('Failure Tracker not found in database.');
    }

    const updatedFailureTrackerProperties = { ...existingFailureTracker, ...failureTrackerChanges, modifiedOn: null };
    const updatedFailureTracker = createFailureTracker(updatedFailureTrackerProperties);

    const updatedFailureTrackerInDb = await failureTrackerDb.update({
      id: updatedFailureTracker.getId(),
      deployPhase: updatedFailureTracker.getDeployPhase(),
      failureCount: updatedFailureTracker.getFailureCount(),
      reasonsForFailure: updatedFailureTracker.getFailureReasons(),
      createdOn: updatedFailureTracker.getCreatedOn(),
      modifiedOn: updatedFailureTracker.getModifiedOn(),
    }, 'failureTrackers');

    if (!updatedFailureTrackerInDb) {
      return existingFailureTracker;
    }

    return updatedFailureTrackerInDb;
  };
}

module.exports = { makeUpdateFailureTracker };
