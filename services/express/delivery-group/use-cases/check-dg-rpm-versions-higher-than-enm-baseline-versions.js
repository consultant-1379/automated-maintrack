function makeCheckDgRpmVersionsHigherThanEnmBaselineVersions(compareVersions) {
  return async function checkDgRpmVersionsHigherThanEnmBaselineVersions(queuedDeliveryGroup, allEnmPackages,
    enmTestwarePackages, doesDeliveryGroupContainTestware) {
    if (doesDeliveryGroupContainTestware) {
      allEnmPackages.push(...enmTestwarePackages);
    }
    for (const deliveryGroupArtifact of queuedDeliveryGroup.artifacts) {
      for (const enmPackage of allEnmPackages) {
        if (deliveryGroupArtifact.artifact === enmPackage.name) {
          if (compareVersions.compare(enmPackage.version, deliveryGroupArtifact.version, '>=')) {
            return false;
          }
        }
      }
    }
    return true;
  };
}

module.exports = { makeCheckDgRpmVersionsHigherThanEnmBaselineVersions };
