const expect = require('expect');

const { makeCheckForTestEnvironmentAvailableDeliveryGroups } = require('../../use-cases/check-for-test-environment-available-delivery-groups');
const { makeFakeFailureTracker } = require('../../../__test__/fixtures/failureTracker');

const VALID_TEST_ENVIRONMENT_AND_DELIVERY_GROUPS = {
  queuedDeliveryGroups: [
    {
      createdByTeam: 'Dhruva',
      deliveryGroupId: '44580',
      includedCategories: 'service',
      deliveredRpms: {
        queuedDeliveryGroups: [
          {
            createdByTeam: 'Dhruva',
            deliveryGroupId: '44580',
            includedCategories: 'service',
            deliveredRpms: [Array],
            typeOfDelivery: 'auto',
          },
        ],
        testEnvironment: { name: '297', clusterType: 'any' },
      },
      typeOfDelivery: 'auto',
    },
  ],
  testEnvironment: { name: '297', clusterType: 'any' },
};

const ERRORED_DELIVERY_GROUP = {
  queuedDeliveryGroups: [
    {
      error: 'No Delivery Groups',
    },
  ],
  testEnvironment: { name: '297', clusterType: 'any' },
};

describe('Unit Test: Check for available delivery groups use case', () => {
  const failureTracker = makeFakeFailureTracker();
  const emailRecipient = 'test@test.com';
  it('should return a valid delivery group', async () => {
    const checkForTestEnvironmentAvailableDeliveryGroups = makeCheckForTestEnvironmentAvailableDeliveryGroups(
      { findTestEnvironmentQueuedDeliveryGroups: () => VALID_TEST_ENVIRONMENT_AND_DELIVERY_GROUPS },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
      { },
      { retrieveNumberOfDeliveryGroups: () => 3 },
    );

    const testEnvironmentAndDeliveryGroups = await checkForTestEnvironmentAvailableDeliveryGroups(failureTracker, emailRecipient);
    expect(testEnvironmentAndDeliveryGroups).toEqual(VALID_TEST_ENVIRONMENT_AND_DELIVERY_GROUPS);
  });
  it('should throw an error when delivery groups is null', (done) => {
    const checkForTestEnvironmentAvailableDeliveryGroups = makeCheckForTestEnvironmentAvailableDeliveryGroups(
      { findTestEnvironmentQueuedDeliveryGroups: () => null },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
      { },
      { retrieveNumberOfDeliveryGroups: () => 2 },
    );

    checkForTestEnvironmentAvailableDeliveryGroups(failureTracker, emailRecipient).catch((error) => {
      expect(error.message).toBe('Delivery Groups was null');
    })
      .then(done, done);
  });
  it('should throw an error if no delivery groups were found', (done) => {
    const checkForTestEnvironmentAvailableDeliveryGroups = makeCheckForTestEnvironmentAvailableDeliveryGroups(
      { findTestEnvironmentQueuedDeliveryGroups: () => ERRORED_DELIVERY_GROUP },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
      { },
      { retrieveNumberOfDeliveryGroups: () => 1 },
    );

    checkForTestEnvironmentAvailableDeliveryGroups(failureTracker, emailRecipient).catch((error) => {
      expect(error.message).toBe('No Delivery Groups');
    })
      .then(done, done);
  });
});
