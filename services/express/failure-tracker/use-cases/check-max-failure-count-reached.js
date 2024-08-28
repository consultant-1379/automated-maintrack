function makeCheckMaxFailureCountReached() {
  return function checkMaxFailureCountReached(failureTracker, maxFailureCount) {
    if (!maxFailureCount) {
      throw new Error('You must specify a max failure count.');
    }
    if (!Number.isInteger(maxFailureCount) || maxFailureCount <= 0) {
      throw new Error('Max failure count number must be a positive number and also must be an integer.');
    }
    return (failureTracker.failureCount >= maxFailureCount);
  };
}

module.exports = { makeCheckMaxFailureCountReached };
