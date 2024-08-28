function makeFilterDuplicateRpms(compareVersions) {
  function filterArtifacts(allDeliveryGroups) {
    const filteredArtifacts = {};
    for (const deliveryGroup of allDeliveryGroups) {
      for (const artifact of deliveryGroup.artifacts) {
        if (!filteredArtifacts[artifact.artifact] || compareVersions.compare(filteredArtifacts[artifact.artifact].version, artifact.version, '>')) {
          filteredArtifacts[artifact.artifact] = {
            deliveryGroup: deliveryGroup.deliveryGroup,
            version: artifact.version,
          };
        }
      }
    }
    return filteredArtifacts;
  }

  function filterDeliveryGroupIds(filteredArtifacts) {
    const filteredDeliveryGroupIds = [];
    for (const artifact in filteredArtifacts) {
      if (!filteredDeliveryGroupIds.includes(filteredArtifacts[artifact].deliveryGroup)) {
        filteredDeliveryGroupIds.push(filteredArtifacts[artifact].deliveryGroup);
      }
    }
    return filteredDeliveryGroupIds;
  }

  function filterDeliveryGroups(filteredDeliveryGroupIds, allDeliveryGroups) {
    const filteredDeliveryGroups = [];
    for (let i = 0; i < filteredDeliveryGroupIds.length; i += 1) {
      const deliveryGroupId = filteredDeliveryGroupIds[i];
      for (const deliveryGroup in allDeliveryGroups) {
        if (allDeliveryGroups[deliveryGroup].deliveryGroup === deliveryGroupId) {
          filteredDeliveryGroups.push(allDeliveryGroups[deliveryGroup]);
        }
      }
    }
    return filteredDeliveryGroups;
  }

  return function filterDuplicateRpms(allDeliveryGroups) {
    const filteredArtifacts = filterArtifacts(allDeliveryGroups);
    const filteredDeliveryGroupIds = filterDeliveryGroupIds(filteredArtifacts);
    const filteredDeliveryGroups = filterDeliveryGroups(filteredDeliveryGroupIds, allDeliveryGroups);
    return filteredDeliveryGroups;
  };
}

module.exports = { makeFilterDuplicateRpms };
