function makeCheckIfDeliveryGroupContainsTestware() {
  return function checkIfDeliveryGroupContainsTestware(queuedDeliveryGroup) {
    for (const artifact of queuedDeliveryGroup.artifacts) {
      if (artifact.category === 'testware') {
        return true;
      }
    }
    return false;
  };
}

module.exports = { makeCheckIfDeliveryGroupContainsTestware };
