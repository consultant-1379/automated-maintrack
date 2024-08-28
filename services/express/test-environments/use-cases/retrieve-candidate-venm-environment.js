function buildRetrieveCandidateVenmEnvironment({ request, emtUrl, findTestEnvironmentBasedOffVersionOrder }) {
  return async function retrieveCandidateVenmEnvironment(state, testPhase, versioningOrder) {
    let environmentsBody;

    if (!state || !testPhase || !versioningOrder) {
      throw new Error('You must supply a state, a testPhase and a versioningOrder.');
    }

    if (!['latest', 'oldest'].includes(versioningOrder)) {
      throw new Error('You must use either latest or oldest for the versioningOrder value.');
    }
    const emtSearchQueryUrl = `${emtUrl}/api/deployments/search?`;
    const searchQuery = `q=state=${state}&q=testPhase=${testPhase}&q=platformType=vENM&q=systemHealthCheckStatus=COMPLETED`;
    await request.get(`${emtSearchQueryUrl}${searchQuery}`)
      .then((environmentsData) => {
        environmentsBody = environmentsData.body;
      }).catch((err) => {
        throw new Error(err);
      });

    const candidateEnvironmentName = findTestEnvironmentBasedOffVersionOrder(environmentsBody, versioningOrder);

    return Object.freeze({
      candidateEnvironmentName,
    });
  };
}

module.exports = { buildRetrieveCandidateVenmEnvironment };
