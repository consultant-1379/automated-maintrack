const expect = require('expect');

const { makeCheckForAvailableTestEnvironments } = require('../../use-cases/check-for-available-test-environments');
const { makeFakeFailureTracker } = require('../../../__test__/fixtures/failureTracker');

const validPhysicalTestEnvironments = [{
  candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
  candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
  candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
},
{
  candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
  candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
  candidatePhysicalEvtsTestEnvironment: { name: '', clusterType: '' },
}, {
  candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
  candidatePhysicalAutTestEnvironment: { name: '', clusterType: '' },
  candidatePhysicalEvtsTestEnvironment: { name: '', clusterType: '' },
},
];

const validCloudTestEnvironment = {
  candidateEnvironmentName: 'ieatenmc7a12',
};

const invalidCloudTestEnvironment = {
  candidateEnvironmentName: '',
};

const invalidPhysicalTestEnvironments = {
  candidatePhysicalVersioningTestEnvironment: { name: '', clusterType: '' },
  candidatePhysicalAutTestEnvironment: { name: '', clusterType: '' },
  candidatePhysicalEvtsTestEnvironment: { name: '', clusterType: '' },
};

describe('Unit Test: Check for available test environments use case', () => {
  const failureTracker = makeFakeFailureTracker();
  const emailRecipient = 'test@test.com';
  it('should return all valid physical test environments', async () => {
    const checkForAvailableTestEnvironments = makeCheckForAvailableTestEnvironments(
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
      {
        retrieveCandidatePhysicalEnvironments: () => validPhysicalTestEnvironments[0],
        retrieveCandidateVenmEnvironment:
        () => validCloudTestEnvironment,
      },
      { sendEmailService: () => '' },
    );

    const testEnvironments = await checkForAvailableTestEnvironments(failureTracker, emailRecipient);

    expect(testEnvironments.candidatePhysicalVersioningTestEnvironment.name)
      .toEqual(validPhysicalTestEnvironments[0].candidatePhysicalVersioningTestEnvironment.name);
    expect(testEnvironments.candidatePhysicalAutTestEnvironment.name)
      .toEqual(validPhysicalTestEnvironments[0].candidatePhysicalAutTestEnvironment.name);
    expect(testEnvironments.candidatePhysicalEvtsTestEnvironment.name)
      .toEqual(validPhysicalTestEnvironments[0].candidatePhysicalEvtsTestEnvironment.name);
    expect(testEnvironments.candidatePhysicalVersioningTestEnvironment.clusterType)
      .toEqual(validPhysicalTestEnvironments[0].candidatePhysicalVersioningTestEnvironment.clusterType);
    expect(testEnvironments.candidatePhysicalAutTestEnvironment.clusterType)
      .toEqual(validPhysicalTestEnvironments[0].candidatePhysicalAutTestEnvironment.clusterType);
    expect(testEnvironments.candidatePhysicalEvtsTestEnvironment.clusterType)
      .toEqual(validPhysicalTestEnvironments[0].candidatePhysicalEvtsTestEnvironment.clusterType);
  });
  it('should return two valid physical test environments', async () => {
    const checkForAvailableTestEnvironments = makeCheckForAvailableTestEnvironments(
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
      {
        retrieveCandidatePhysicalEnvironments: () => validPhysicalTestEnvironments[1],
        retrieveCandidateVenmEnvironment:
        () => validCloudTestEnvironment,
      },
      { sendEmailService: () => '' },
    );

    const testEnvironments = await checkForAvailableTestEnvironments(failureTracker, emailRecipient);

    expect(testEnvironments.candidatePhysicalVersioningTestEnvironment.name)
      .toEqual(validPhysicalTestEnvironments[1].candidatePhysicalVersioningTestEnvironment.name);
    expect(testEnvironments.candidatePhysicalAutTestEnvironment.name)
      .toEqual(validPhysicalTestEnvironments[1].candidatePhysicalAutTestEnvironment.name);
    expect(testEnvironments.candidatePhysicalEvtsTestEnvironment.name)
      .toEqual(validPhysicalTestEnvironments[1].candidatePhysicalEvtsTestEnvironment.name);
    expect(testEnvironments.candidatePhysicalVersioningTestEnvironment.clusterType)
      .toEqual(validPhysicalTestEnvironments[1].candidatePhysicalVersioningTestEnvironment.clusterType);
    expect(testEnvironments.candidatePhysicalAutTestEnvironment.clusterType)
      .toEqual(validPhysicalTestEnvironments[1].candidatePhysicalAutTestEnvironment.clusterType);
    expect(testEnvironments.candidatePhysicalEvtsTestEnvironment.clusterType)
      .toEqual(validPhysicalTestEnvironments[1].candidatePhysicalEvtsTestEnvironment.clusterType);
  });
  it('should return one valid physical test environments', async () => {
    const checkForAvailableTestEnvironments = makeCheckForAvailableTestEnvironments(
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
      {
        retrieveCandidatePhysicalEnvironments: () => validPhysicalTestEnvironments[2],
        retrieveCandidateVenmEnvironment:
        () => validCloudTestEnvironment,
      },
      { sendEmailService: () => '' },
    );

    const testEnvironments = await checkForAvailableTestEnvironments(failureTracker, emailRecipient);

    expect(testEnvironments.candidatePhysicalVersioningTestEnvironment.name)
      .toEqual(validPhysicalTestEnvironments[2].candidatePhysicalVersioningTestEnvironment.name);
    expect(testEnvironments.candidatePhysicalAutTestEnvironment.name)
      .toEqual(validPhysicalTestEnvironments[2].candidatePhysicalAutTestEnvironment.name);
    expect(testEnvironments.candidatePhysicalEvtsTestEnvironment.name)
      .toEqual(validPhysicalTestEnvironments[2].candidatePhysicalEvtsTestEnvironment.name);
    expect(testEnvironments.candidatePhysicalVersioningTestEnvironment.clusterType)
      .toEqual(validPhysicalTestEnvironments[2].candidatePhysicalVersioningTestEnvironment.clusterType);
    expect(testEnvironments.candidatePhysicalAutTestEnvironment.clusterType)
      .toEqual(validPhysicalTestEnvironments[2].candidatePhysicalAutTestEnvironment.clusterType);
    expect(testEnvironments.candidatePhysicalEvtsTestEnvironment.clusterType)
      .toEqual(validPhysicalTestEnvironments[2].candidatePhysicalEvtsTestEnvironment.clusterType);
  });
  it('should return valid cloud test environments', async () => {
    const checkForAvailableTestEnvironments = makeCheckForAvailableTestEnvironments(
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
      {
        retrieveCandidatePhysicalEnvironments: () => validPhysicalTestEnvironments[0],
        retrieveCandidateVenmEnvironment: () => validCloudTestEnvironment,
      },
      { sendEmailService: () => '' },
    );

    const testEnvironments = await checkForAvailableTestEnvironments(failureTracker, emailRecipient);

    expect(testEnvironments.candidateCloudTestEnvironmentName).toEqual(validCloudTestEnvironment.candidateEnvironmentName);
  });
  it('should throw an error when no physical or cloud test environment is found', (done) => {
    const checkForAvailableTestEnvironments = makeCheckForAvailableTestEnvironments(
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
      {
        retrieveCandidatePhysicalEnvironments: () => invalidPhysicalTestEnvironments,
        retrieveCandidateVenmEnvironment: () => invalidCloudTestEnvironment,
      },
      { sendEmailService: () => '' },
    );

    checkForAvailableTestEnvironments(failureTracker, emailRecipient).catch((error) => {
      expect(error.message).toBe('There are no physical IDLE MTE test environments that are SHC completed in EMT at this time. There are no cloud IDLE MTE test environments that are SHC completed in EMT at this time.');
    })
      .then(done, done);
  });
  it('should throw an error when no physical test environments are found', (done) => {
    const checkForAvailableTestEnvironments = makeCheckForAvailableTestEnvironments(
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
      {
        retrieveCandidatePhysicalEnvironments: () => invalidPhysicalTestEnvironments,
        retrieveCandidateVenmEnvironment: () => validCloudTestEnvironment,
      },
      { sendEmailService: () => '' },
    );

    checkForAvailableTestEnvironments(failureTracker, emailRecipient).catch((error) => {
      expect(error.message).toBe('There are no physical IDLE MTE test environments that are SHC completed in EMT at this time. ');
    })
      .then(done, done);
  });
  it('should throw an error when no cloud test environment is found', (done) => {
    const checkForAvailableTestEnvironments = makeCheckForAvailableTestEnvironments(
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
      {
        retrieveCandidatePhysicalEnvironments: () => validPhysicalTestEnvironments[0],
        retrieveCandidateVenmEnvironment: () => invalidCloudTestEnvironment,
      },
      { sendEmailService: () => '' },
    );

    checkForAvailableTestEnvironments(failureTracker, emailRecipient).catch((error) => {
      expect(error.message).toBe('There are no cloud IDLE MTE test environments that are SHC completed in EMT at this time.');
    })
      .then(done, done);
  });
});
