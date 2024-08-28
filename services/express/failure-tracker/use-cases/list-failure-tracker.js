function makeListFailureTracker(failureTrackerDb) {
  return async function listFailureTracker(deployPhase) {
    if (!deployPhase) {
      throw new Error('You must specify a deploy phase.');
    }
    if (!['upgrade', 'install'].includes(deployPhase)) {
      throw new Error('You must use either upgrade or install for the deploy phase value.');
    }

    const failureTracker = await failureTrackerDb.findBySearchQuery(deployPhase, 'failureTrackers');
    if (failureTracker && failureTracker.length) {
      if (failureTracker.length > 1) {
        throw new Error(`More then one failure tracker with deploy phase ${deployPhase} was found.`);
      }
      return failureTracker[0];
    }
    return null;
  };
}

module.exports = { makeListFailureTracker };
