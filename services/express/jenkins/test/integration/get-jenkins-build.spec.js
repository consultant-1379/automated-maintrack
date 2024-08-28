const expect = require('expect');
const jenkins = require('jenkins');

const { makeGetJenkinsJob } = require('../../use-cases/get-jenkins-job');
const { makeGetJenkinsBuild } = require('../../use-cases/get-jenkins-build');
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

((BB_USER && BB_PASS) ? describe : describe.skip)('Integration Test: get jenkins build.', () => {
  let functionalUserIsAvailableOrTesting;
  let getJenkinsJob;
  let getJenkinsBuild;
  let jobName;
  before(() => {
    jobName = process.env.INTEGRATION_TEST_TARGET_JOB;
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    getJenkinsJob = makeGetJenkinsJob(TestFemJenkinsClient, functionalUserIsAvailableOrTesting);
    getJenkinsBuild = makeGetJenkinsBuild(TestFemJenkinsClient, functionalUserIsAvailableOrTesting);
  });
  it('should get the last and second last build.', async () => {
    const job = await getJenkinsJob(jobName);
    const numBuilds = findChild(job, 'builds').length;
    if (numBuilds > 1) {
      const lastBuildNumber = findChild(job, 'lastBuild', 'number');
      const secondLastBuildNumber = lastBuildNumber - 1;
      const lastBuild = await getJenkinsBuild(jobName, lastBuildNumber);
      const secondLastBuild = await getJenkinsBuild(jobName, secondLastBuildNumber);
      expect(lastBuildNumber).toEqual(findChild(lastBuild, 'number'));
      expect(secondLastBuildNumber).toBe(findChild(secondLastBuild, 'number'));
    } else {
      console.log(`Could not test for multiple builds as there are not enough available. (Have: ${numBuilds}, need: 2)`);
    }
  });
});
