function buildVerifyEnvironmentStateBusyWithExpectedProductSetVersion(request, emtUrl) {
  return async function verifyEnvironmentStateBusyWithExpectedProductSetVersion(environmentName, productSetVersion) {
    let environmentBody;

    if (!environmentName || !productSetVersion) {
      throw new Error('You must supply an environmentName and a productSetVersion when checking if there is an environment busy with the specified product set');
    }

    const emtSearchQueryUrl = `${emtUrl}/api/deployments/search?`;
    const searchQuery = `q=name=${environmentName}`;
    await request.get(`${emtSearchQueryUrl}${searchQuery}`)
      .then((environmentData) => {
        environmentBody = environmentData.body;
      }).catch((err) => {
        throw new Error(err);
      });

    return productSetVersion === 'pending' ? environmentBody[0].state === 'BUSY'
      : environmentBody[0].productSet === productSetVersion && environmentBody[0].state === 'BUSY';
  };
}

module.exports = { buildVerifyEnvironmentStateBusyWithExpectedProductSetVersion };
