function makeFindTestEnvironmentQueuedDeliveryGroups(useExternalApiService, retrieveValidDeliveryGroups) {
  function populateRpmsDeliveredInDeliveryGroup(deliveredRpms) {
    const populatedDeliveredRpms = [];
    deliveredRpms.forEach((rpm) => {
      populatedDeliveredRpms.push({
        name: rpm.artifact,
        category: rpm.category,
        version: rpm.version,
      });
    });
    return populatedDeliveredRpms;
  }

  function populateValidDeliveryGroup(queuedDeliveryGroups, team, deliveryGroup, categories, deliveredRpms) {
    queuedDeliveryGroups.push({
      createdByTeam: team,
      deliveryGroupId: deliveryGroup,
      includedCategories: categories,
      deliveredRpms: populateRpmsDeliveredInDeliveryGroup(deliveredRpms),
      typeOfDelivery: 'auto',
    });
  }

  function populateInvalidDeliveryGroup(queuedDeliveryGroups, errorMessage) {
    queuedDeliveryGroups.push({
      error: errorMessage,
    });
  }

  return async function findTestEnvironmentQueuedDeliveryGroups(numberOfDeliveryGroupsNeeded = 4, latestDrop, testEnvironments) {
    const queuedDeliveryGroups = [];
    if (Number.isNaN(numberOfDeliveryGroupsNeeded) || numberOfDeliveryGroupsNeeded <= 0) {
      throw new Error('Number of delivery groups needed must be a positive and also must be of type number');
    }
    const allQueuedDeliveryGroups = await useExternalApiService.useExternalApi.getQueuedDeliveryGroups(latestDrop);
    const validTestEnvironmentAndQueuedDeliveryGroups = await
    retrieveValidDeliveryGroups(allQueuedDeliveryGroups.reverse(), numberOfDeliveryGroupsNeeded, testEnvironments);

    if (validTestEnvironmentAndQueuedDeliveryGroups.validDeliveryGroups.length === 0) {
      populateInvalidDeliveryGroup(queuedDeliveryGroups, 'No Delivery Groups');
      return { queuedDeliveryGroups, testEnvironment: validTestEnvironmentAndQueuedDeliveryGroups.testEnvironment };
    }
    if (validTestEnvironmentAndQueuedDeliveryGroups.validDeliveryGroups.length < numberOfDeliveryGroupsNeeded) {
      numberOfDeliveryGroupsNeeded = validTestEnvironmentAndQueuedDeliveryGroups.validDeliveryGroups.length;
    }

    for (let i = 0; i < numberOfDeliveryGroupsNeeded; i += 1) {
      const includedCategories = [];
      for (const artifacts of validTestEnvironmentAndQueuedDeliveryGroups.validDeliveryGroups[i].artifacts) {
        if (includedCategories.indexOf(artifacts.category) === -1) {
          includedCategories.push(artifacts.category);
        }
      }

      populateValidDeliveryGroup(queuedDeliveryGroups, validTestEnvironmentAndQueuedDeliveryGroups.validDeliveryGroups[i].createdByTeam,
        validTestEnvironmentAndQueuedDeliveryGroups.validDeliveryGroups[i].deliveryGroup, includedCategories.toString(),
        validTestEnvironmentAndQueuedDeliveryGroups.validDeliveryGroups[i].artifacts);
    }
    return { queuedDeliveryGroups, testEnvironment: validTestEnvironmentAndQueuedDeliveryGroups.testEnvironment };
  };
}

module.exports = { makeFindTestEnvironmentQueuedDeliveryGroups };
