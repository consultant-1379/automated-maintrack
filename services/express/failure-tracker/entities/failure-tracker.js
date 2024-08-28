function buildMakeFailureTracker({ Id }) {
  return function makeFailureTracker({
    id = Id.makeId(),
    deployPhase,
    failureCount = 0,
    reasonsForFailure,
    createdOn = Date.now(),
    modifiedOn = Date.now(),
  } = {}) {
    if (!Id.isValidId(id)) {
      throw new Error('Failure tracker must have a valid id.');
    }
    if (!deployPhase) {
      throw new Error('You must specify a deploy phase.');
    }
    if (!['upgrade', 'install'].includes(deployPhase)) {
      throw new Error('You must use either upgrade or install for the deploy phase value');
    }
    return Object.freeze({
      getDeployPhase: () => deployPhase,
      getFailureCount: () => failureCount,
      getFailureReasons: () => reasonsForFailure,
      getId: () => id,
      getCreatedOn: () => createdOn,
      getModifiedOn: () => modifiedOn,
    });
  };
}

module.exports = { buildMakeFailureTracker };
