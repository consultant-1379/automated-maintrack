const expect = require('expect');
const sinon = require('sinon');

const { makeCheckIsJenkinsJobOngoing } = require('../../../jenkins/use-cases/check-is-jenkins-job-ongoing');
const { makeAttemptSlotActionIfNoBlockingJob } = require('../../use-cases/attempt-slot-action-if-no-blocking-job');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../../jenkins/use-cases/check-is-functional-user-available-or-testing');

const spyObject = {
  fakeSlotAction: (arg1, arg2) => `Kicked off fake slot action! args passed: ${arg1}, ${arg2}`,
};

function findChild(parentObject, ...args) {
  return args.reduce((object, property) => object && object[property], parentObject);
}

function fakeGetJenkinsJob(jobName) {
  const jobs = {
    FAKE_COMPLETED_JOB: {
      lastBuild: {
        number: 25,
      },
      lastCompletedBuild: {
        number: 25,
      },
    },
    FAKE_ONGOING_JOB: {
      lastBuild: {
        number: 50,
      },
      lastCompletedBuild: {
        number: 49,
      },
    },
  };

  return new Promise((resolve, reject) => {
    if (jobs[jobName]) resolve(jobs[jobName]);
    const lastBuildNumber = findChild(jobs[jobName], 'lastBuild', 'number');
    const lastCompletedBuildNumber = findChild(jobs[jobName], 'lastCompletedBuild', 'number');
    reject(new Error(`TRUNCATED ERR MSG: (${lastBuildNumber})(${lastCompletedBuildNumber})(${jobName}).`));
  });
}

describe('Unit Test: attempt slot action if no blocking jobs', () => {
  let completedJob;
  let ongoingJob;
  let nonExistantJob;
  let functionalUserIsAvailableOrTesting;
  let fakeCheckIsJenkinsJobOngoing;
  let wrappedSlotAction;
  let fakeSlotActionSpy;
  before(() => {
    completedJob = 'FAKE_COMPLETED_JOB';
    ongoingJob = 'FAKE_ONGOING_JOB';
    nonExistantJob = 'ANY_NON_EXISTANT_JOB_OR_JOB_MISSING_DATA';
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    fakeCheckIsJenkinsJobOngoing = makeCheckIsJenkinsJobOngoing(fakeGetJenkinsJob, functionalUserIsAvailableOrTesting);
    fakeSlotActionSpy = sinon.spy(spyObject, 'fakeSlotAction');
    wrappedSlotAction = makeAttemptSlotActionIfNoBlockingJob(fakeSlotActionSpy, fakeCheckIsJenkinsJobOngoing);
  });
  afterEach(() => {
    fakeSlotActionSpy.resetHistory();
  });
  it('should attempt a slot action if the blocking job is not ongoing', async () => {
    const response = await wrappedSlotAction('Wrapped Slot Action', 3, 0, completedJob, 'slotActionArg1', 'slotActionArg2');
    expect(response).toEqual('Kicked off fake slot action! args passed: slotActionArg1, slotActionArg2');
    sinon.assert.calledOnce(fakeSlotActionSpy);
  });
  it('should not attempt a slot action if the blocking job is ongoing', async () => {
    const response = await wrappedSlotAction('Wrapped Slot Action', 3, 0, ongoingJob, 'slotActionArg1', 'slotActionArg2');
    expect(response).toEqual(undefined);
    sinon.assert.notCalled(fakeSlotActionSpy);
  });
  it('should return an error if the blocking job does not exist', async () => {
    try {
      await wrappedSlotAction('Wrapped Slot Action', 3, 0, nonExistantJob, 'slotActionArg1', 'slotActionArg2');
    } catch (error) {
      expect(error).toEqual(new Error('TRUNCATED ERR MSG: (undefined)(undefined)(ANY_NON_EXISTANT_JOB_OR_JOB_MISSING_DATA).'));
    }
  });
});
