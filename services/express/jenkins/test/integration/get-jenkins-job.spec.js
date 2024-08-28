const expect = require('expect');
const jenkins = require('jenkins');

const { makeGetJenkinsJob } = require('../../use-cases/get-jenkins-job');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

const BB_USER = process.env.BB_FUNCTIONAL_USER;
const BB_PASS = process.env.BB_FUNCTIONAL_USER_PASSWORD;
const JENKINS_URL = process.env.TEST_JENKINS_URL;

const TestFemJenkinsClient = jenkins({
  baseUrl:
      `https://${BB_USER}:${BB_PASS}@${JENKINS_URL}/jenkins`,
});

function findChild(parentObject, ...args) {
  return args.reduce((object, property) => object && object[property], parentObject);
}

((BB_USER && BB_PASS) ? describe : describe.skip)('Integration Test: get jenkins job.', () => {
  let functionalUserIsAvailableOrTesting;
  let getJenkinsJob;
  let jobName;
  before(() => {
    jobName = process.env.INTEGRATION_TEST_TARGET_JOB;
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    getJenkinsJob = makeGetJenkinsJob(TestFemJenkinsClient, functionalUserIsAvailableOrTesting);
  });
  it('should get the name for the jenkins job.', async () => {
    const job = await getJenkinsJob(jobName);
    const findJobName = findChild(job, 'name');
    expect(jobName).toBe(findJobName);
  });
});
