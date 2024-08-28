function buildRetrieveCandidatePhysicalEnvironments({
  request, emtUrl, findTestEnvironmentBasedOffVersionOrder, useExternalApiService,
}) {
  async function findTestEnvironmentBasedOffServerNodeType(environments, serverNodeType) {
    let candidateEnvironment;
    let deploymentDescription;
    let environment;
    for (environment in environments) {
      if (Object.prototype.hasOwnProperty.call(environments, environment)) {
        deploymentDescription = await useExternalApiService.useExternalApi.getDeploymentDescription(environments[environment].name);
        if (deploymentDescription.includes(serverNodeType)) {
          candidateEnvironment = environments[environment].name;
          break;
        }
      }
    }
    return candidateEnvironment;
  }

  return async function retrieveCandidatePhysicalEnvironments(state, testPhase, versioningOrder) {
    let environmentsBody;

    if (!state || !testPhase || !versioningOrder) {
      throw new Error('You must supply a state, a testPhase and a versioningOrder.');
    }

    if (!['latest', 'oldest'].includes(versioningOrder)) {
      throw new Error('You must use either latest or oldest for the versioningOrder value.');
    }
    const emtSearchQueryUrl = `${emtUrl}/api/deployments/search?`;
    const searchQuery = `q=state=${state}&q=testPhase=${testPhase}&q=platformType=physical&q=systemHealthCheckStatus=COMPLETED`;

    await request.get(`${emtSearchQueryUrl}${searchQuery}`)
      .then((environmentsData) => {
        environmentsBody = environmentsData.body;
      }).catch((err) => {
        throw new Error(err);
      });

    const candidateEnvironmentVersioningName = findTestEnvironmentBasedOffVersionOrder(environmentsBody, versioningOrder);
    const candidateEnvironmentAutName = await findTestEnvironmentBasedOffServerNodeType(environmentsBody, 'aut');
    const candidateEnvironmentEvtName = await findTestEnvironmentBasedOffServerNodeType(environmentsBody, 'evt');

    return {
      candidatePhysicalVersioningTestEnvironment: { name: candidateEnvironmentVersioningName, clusterType: 'any' },
      candidatePhysicalAutTestEnvironment: { name: candidateEnvironmentAutName, clusterType: 'automation' },
      candidatePhysicalEvtsTestEnvironment: { name: candidateEnvironmentEvtName, clusterType: 'events' },
    };
  };
}

module.exports = { buildRetrieveCandidatePhysicalEnvironments };
