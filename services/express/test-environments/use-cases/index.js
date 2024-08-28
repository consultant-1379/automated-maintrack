const request = require('superagent');
const { buildRetrieveCandidatePhysicalEnvironments } = require('./retrieve-candidate-physical-environment');
const { buildRetrieveCandidateVenmEnvironment } = require('./retrieve-candidate-venm-environment');
const { buildVerifyEnvironmentStateBusyWithExpectedProductSetVersion } = require('./check-environment-with-product-set-busy');
const { makeFindTestEnvironmentBasedOffVersionOrder } = require('./find-test-environment-based-off-version-order');
const { useExternalApiService } = require('../../external-apis');

const emtUrl = process.env.EMT_URL;

const findTestEnvironmentBasedOffVersionOrder = makeFindTestEnvironmentBasedOffVersionOrder();
const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments({
  request, emtUrl, findTestEnvironmentBasedOffVersionOrder, useExternalApiService,
});
const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment({ request, emtUrl, findTestEnvironmentBasedOffVersionOrder });
const verifyEnvironmentStateBusyWithExpectedProductSetVersion = buildVerifyEnvironmentStateBusyWithExpectedProductSetVersion(request, emtUrl);

const testEnvironmentService = Object.freeze({
  retrieveCandidatePhysicalEnvironments,
  retrieveCandidateVenmEnvironment,
  verifyEnvironmentStateBusyWithExpectedProductSetVersion,
  findTestEnvironmentBasedOffVersionOrder,
});

module.exports = {
  testEnvironmentService,
  retrieveCandidatePhysicalEnvironments,
  retrieveCandidateVenmEnvironment,
  verifyEnvironmentStateBusyWithExpectedProductSetVersion,
  findTestEnvironmentBasedOffVersionOrder,
};
