function makeDecideOnDgCategoryAndTestEnvironmentToPick() {
  return function decideOnDgCategoryAndTestEnvironmentToPick(allDeliveryGroups, testEnvironments) {
    if (testEnvironments.candidatePhysicalVersioningTestEnvironment.name
      && !testEnvironments.candidatePhysicalAutTestEnvironment.name && !testEnvironments.candidatePhysicalEvtsTestEnvironment.name) {
      return testEnvironments.candidatePhysicalVersioningTestEnvironment;
    }

    if (testEnvironments.candidatePhysicalVersioningTestEnvironment.name
      && testEnvironments.candidatePhysicalAutTestEnvironment.name && !testEnvironments.candidatePhysicalEvtsTestEnvironment.name) {
      return testEnvironments.candidatePhysicalAutTestEnvironment;
    }

    if (testEnvironments.candidatePhysicalVersioningTestEnvironment.name
      && !testEnvironments.candidatePhysicalAutTestEnvironment.name && testEnvironments.candidatePhysicalEvtsTestEnvironment.name) {
      return testEnvironments.candidatePhysicalEvtsTestEnvironment;
    }

    if (!testEnvironments.candidatePhysicalVersioningTestEnvironment.name
      && testEnvironments.candidatePhysicalAutTestEnvironment.name && !testEnvironments.candidatePhysicalEvtsTestEnvironment.name) {
      return testEnvironments.candidatePhysicalAutTestEnvironment;
    }

    if (!testEnvironments.candidatePhysicalVersioningTestEnvironment.name
      && !testEnvironments.candidatePhysicalAutTestEnvironment.name && testEnvironments.candidatePhysicalEvtsTestEnvironment.name) {
      return testEnvironments.candidatePhysicalEvtsTestEnvironment;
    }

    let candidateDgCategoryTestEnvironment;
    let automationCategoryCounter = 0;
    let eventsCategoryCounter = 0;
    for (const queuedDeliveryGroup of allDeliveryGroups) {
      for (const artifact of queuedDeliveryGroup.artifacts) {
        if (artifact.category.includes('automation')) {
          automationCategoryCounter += 1;
        }
        if (artifact.category.includes('events')) {
          eventsCategoryCounter += 1;
        }
      }
    }

    if (!automationCategoryCounter && !eventsCategoryCounter && testEnvironments.candidatePhysicalVersioningTestEnvironment) {
      return testEnvironments.candidatePhysicalVersioningTestEnvironment;
    }
    if (automationCategoryCounter > eventsCategoryCounter) {
      candidateDgCategoryTestEnvironment = testEnvironments.candidatePhysicalAutTestEnvironment;
    }
    if (automationCategoryCounter < eventsCategoryCounter) {
      candidateDgCategoryTestEnvironment = testEnvironments.candidatePhysicalEvtsTestEnvironment;
    }
    if (automationCategoryCounter === eventsCategoryCounter) {
      const randomTestEnvironments = [testEnvironments.candidatePhysicalAutTestEnvironment, testEnvironments.candidatePhysicalEvtsTestEnvironment];
      candidateDgCategoryTestEnvironment = randomTestEnvironments[Math.floor(Math.random() * randomTestEnvironments.length)];
    }
    return candidateDgCategoryTestEnvironment;
  };
}

module.exports = { makeDecideOnDgCategoryAndTestEnvironmentToPick };
