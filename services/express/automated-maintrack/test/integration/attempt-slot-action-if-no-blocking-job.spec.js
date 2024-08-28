const expect = require('expect');
const sinon = require('sinon');
const jenkins = require('jenkins');

const { makeGetJenkinsJob } = require('../../../jenkins/use-cases/get-jenkins-job');
const { makeCheckIsJenkinsJobOngoing } = require('../../../jenkins/use-cases/check-is-jenkins-job-ongoing');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../../jenkins/use-cases/check-is-functional-user-available-or-testing');
const { makeAttemptSlotActionIfNoBlockingJob } = require('../../../automated-maintrack/use-cases/attempt-slot-action-if-no-blocking-job');

const BB_USER = process.env.BB_FUNCTIONAL_USER;
const BB_PASS = process.env.BB_FUNCTIONAL_USER_PASSWORD;
const JENKINS_URL = process.env.TEST_JENKINS_URL;

const TestFemJenkinsClient = jenkins({
  baseUrl:
      `https://${BB_USER}:${BB_PASS}@${JENKINS_URL}/jenkins`,
});

const spyObject = {
  fakeSlotAction: (arg1, arg2) => `Kicked off fake slot action! args passed: ${arg1}, ${arg2}`,
};

((BB_USER && BB_PASS) ? describe : describe.skip)('Integration Test: attempt slot action if no blocking job', () => {
  let jobName;
  let nonExistantJob;
  let functionalUserIsAvailableOrTesting;
  let checkIsJenkinsJobOngoing;
  let wrappedSlotAction;
  let fakeSlotActionSpy;
  let getJenkinsJob;
  before(() => {
    jobName = process.env.INTEGRATION_TEST_TARGET_JOB;
    nonExistantJob = 'ANY_NON_EXISTANT_JOB_OR_JOB_MISSING_DATA';
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    getJenkinsJob = makeGetJenkinsJob(TestFemJenkinsClient, functionalUserIsAvailableOrTesting);
    checkIsJenkinsJobOngoing = makeCheckIsJenkinsJobOngoing(getJenkinsJob, functionalUserIsAvailableOrTesting);
    fakeSlotActionSpy = sinon.spy(spyObject, 'fakeSlotAction');
    wrappedSlotAction = makeAttemptSlotActionIfNoBlockingJob(fakeSlotActionSpy, checkIsJenkinsJobOngoing);
  });
  it('should attempt a slot action if the blocking job is not ongoing', async () => {
    const response = await wrappedSlotAction('Wrapped Slot Action', 3, 0, jobName, 'slotActionArg1', 'slotActionArg2');
    expect(response).toEqual('Kicked off fake slot action! args passed: slotActionArg1, slotActionArg2');
    sinon.assert.calledOnce(fakeSlotActionSpy);
  });
  it('should return an error if the blocking job does not exist', async () => {
    try {
      await wrappedSlotAction('Wrapped Slot Action', 3, 0, nonExistantJob, 'slotActionArg1', 'slotActionArg2');
    } catch (error) {
      expect(error).toEqual(new Error(`jenkins: job.get: ${nonExistantJob} not found`));
    }
  });
});
