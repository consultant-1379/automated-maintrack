const expect = require('expect');
const jenkins = require('jenkins');

const { makeGetJenkinsJob } = require('../../use-cases/get-jenkins-job');
const { makeCheckIsJenkinsJobOngoing } = require('../../use-cases/check-is-jenkins-job-ongoing');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

const BB_USER = process.env.BB_FUNCTIONAL_USER;
const BB_PASS = process.env.BB_FUNCTIONAL_USER_PASSWORD;
const JENKINS_URL = process.env.TEST_JENKINS_URL;

const TestFemJenkinsClient = jenkins({
  baseUrl:
      `https://${BB_USER}:${BB_PASS}@${JENKINS_URL}/jenkins`,
});

((BB_USER && BB_PASS) ? describe : describe.skip)('Integration Test: check is jenkins job ongoing.', () => {
  let functionalUserIsAvailableOrTesting;
  let getJenkinsJob;
  let checkIsJenkinsJobOngoing;
  let jobName;
  before(() => {
    jobName = process.env.INTEGRATION_TEST_TARGET_JOB;
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    getJenkinsJob = makeGetJenkinsJob(TestFemJenkinsClient, functionalUserIsAvailableOrTesting);
    checkIsJenkinsJobOngoing = makeCheckIsJenkinsJobOngoing(getJenkinsJob, functionalUserIsAvailableOrTesting);
  });
  it('should return false unless the integration test target job is running.', async () => {
    const isJobsLatestBuildStillOngoing = await checkIsJenkinsJobOngoing(jobName);
    expect(isJobsLatestBuildStillOngoing).toEqual(false);
  });
});
