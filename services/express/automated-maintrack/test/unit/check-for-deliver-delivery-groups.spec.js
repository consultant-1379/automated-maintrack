const expect = require('expect');

const { makeCheckForDeliverDeliveryGroups } = require('./../../use-cases/check-for-deliver-delivery-groups');
const { makeFakeFailureTracker } = require('../../../__test__/fixtures/failureTracker');

const VALID_DELIVERY_GROUP = [{
  createdByTeam: 'Starks',
  deliveryGroupId: '12345',
  includedCategories: 'service,testware',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    name: 'ERICstrike_CXP9034650',
    category: 'ms',
    version: '1.1.12',
  }],
}];

const VALID_DELIVERY_GROUPS = [{
  createdByTeam: 'Starks',
  deliveryGroupId: '12345',
  includedCategories: 'service,testware',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    name: 'ERICtrigger_CXP9030570',
    category: 'ms',
    version: '4.3.6',
  }],
},
{
  createdByTeam: 'Magrathea',
  deliveryGroupId: '23456',
  includedCategories: 'service',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    name: 'ERICazte_CXP9030890',
    category: 'service',
    version: '1.5.9',
  }],
},
{
  createdByTeam: 'Chanakya',
  deliveryGroupId: '34567',
  includedCategories: 'service,model',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    name: 'ERICvulcan_CXP9030570',
    category: 'service',
    version: '1.3.12',
  }],
},
];

const EMPTY_DELIVERY_GROUP = [];

const SUCCESSFUL_DELIVERED_DELIVERY_GROUP = [{
  createdByTeam: 'Starks',
  deliveryGroupId: '12345',
  includedCategories: 'service,testware',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    name: 'ERICstrike_CXP9034650',
    category: 'ms',
    version: '1.1.12',
  }],
}];

const DELIVERED_DELIVERY_GROUP_STATUS = [
  {
    deliveryGroupId: '12345',
    statusCode: 200,
    response: 'Delivery Group 42211 has been delivered',
  },
];

const SUCCESSFUL_DELIVERED_DELIVERY_GROUP_STATUSES = [
  {
    deliveryGroupId: '12345',
    statusCode: 200,
    response: 'Delivery Group 12345 has been delivered',
  },
  {
    deliveryGroupId: '12345',
    statusCode: 200,
    response: 'Delivery Group 12345 has been delivered',
  },
];

const FAILED_DELIVERED_DELIVERY_GROUP_STATUSES = [
  {
    deliveryGroupId: '12345',
    statusCode: 500,
    response: 'Unable to deliver delivery groups, Error: ECONNRESET',
  },
  {
    deliveryGroupId: '23456',
    statusCode: 500,
    response: 'Unable to deliver delivery groups, Error: ECONNRESET',
  },
  {
    deliveryGroupId: '34567',
    statusCode: 500,
    response: 'Unable to deliver delivery groups, Error: ECONNRESET',
  },
];

const PARTIALLY_DELIVERED_DELIVERY_GROUPS = [{
  createdByTeam: 'Starks',
  deliveryGroupId: '12345',
  includedCategories: 'service,testware',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    name: 'ERICtrigger_CXP9030570',
    category: 'ms',
    version: '4.3.6',
  }],
},
{
  createdByTeam: 'Magrathea',
  deliveryGroupId: '23456',
  includedCategories: 'service',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    name: 'ERICazte_CXP9030890',
    category: 'service',
    version: '1.5.9',
  }],
}];

const PARTIALLY_DELIVERED_DELIVERY_GROUP_STATUSES = [
  {
    deliveryGroupId: '12345',
    statusCode: 200,
    response: 'Delivery Group 12345 has been delivered',
  },
  {
    deliveryGroupId: '23456',
    statusCode: 200,
    response: 'Delivery Group 23456 has been delivered',
  },
  {
    deliveryGroupId: '34567',
    statusCode: 500,
    response: 'Unable to deliver delivery groups, Error: ECONNRESET',
  },
];

describe('Unit Test: Check for deliver delivery groups use case', () => {
  const failureTracker = makeFakeFailureTracker();
  const emailRecipient = 'test@test.com';
  it('should successfully return a valid delivered delivery group', async () => {
    const checkForDeliverDeliveryGroups = makeCheckForDeliverDeliveryGroups(
      { deliverDeliveryGroups: () => DELIVERED_DELIVERY_GROUP_STATUS },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
    );

    const deliveredDeliveryGroup = await checkForDeliverDeliveryGroups(failureTracker, emailRecipient, VALID_DELIVERY_GROUP);
    expect(deliveredDeliveryGroup).toEqual(SUCCESSFUL_DELIVERED_DELIVERY_GROUP);
  });

  it('should successfully return valid delivered delivery groups', async () => {
    const checkForDeliverDeliveryGroups = makeCheckForDeliverDeliveryGroups(
      { deliverDeliveryGroups: () => SUCCESSFUL_DELIVERED_DELIVERY_GROUP_STATUSES },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
    );

    const deliveredDeliveryGroups = await checkForDeliverDeliveryGroups(failureTracker, emailRecipient, VALID_DELIVERY_GROUPS);
    expect(deliveredDeliveryGroups).toEqual(VALID_DELIVERY_GROUPS);
  });
  it('should throw an error if all delivery groups fail to deliver', (done) => {
    const checkForDeliverDeliveryGroups = makeCheckForDeliverDeliveryGroups(
      { deliverDeliveryGroups: () => FAILED_DELIVERED_DELIVERY_GROUP_STATUSES },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
    );

    checkForDeliverDeliveryGroups(failureTracker, emailRecipient, VALID_DELIVERY_GROUPS).catch((error) => {
      expect(error.message).toBe('All Delivery Groups failed to automatically deliver.');
    })
      .then(done, done);
  });
  it('should successfully return valid delivered delivery groups even if one of the groups failed to deliver', async () => {
    const checkForDeliverDeliveryGroups = makeCheckForDeliverDeliveryGroups(
      { deliverDeliveryGroups: () => PARTIALLY_DELIVERED_DELIVERY_GROUP_STATUSES },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
    );

    const deliveredDeliveryGroups = await checkForDeliverDeliveryGroups(failureTracker, emailRecipient, VALID_DELIVERY_GROUPS);
    expect(deliveredDeliveryGroups).toEqual(PARTIALLY_DELIVERED_DELIVERY_GROUPS);
  });
  it('should throw an error if the delivery groups passed in is undefined', (done) => {
    const checkForDeliverDeliveryGroups = makeCheckForDeliverDeliveryGroups(
      { deliverDeliveryGroups: () => SUCCESSFUL_DELIVERED_DELIVERY_GROUP_STATUSES },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
    );

    checkForDeliverDeliveryGroups(failureTracker, emailRecipient, undefined).catch((error) => {
      expect(error.message).toBe('You must pass in one or more delivery group(s).');
    })
      .then(done, done);
  });
  it('should throw an error if the delivery groups returned is undefined', (done) => {
    const checkForDeliverDeliveryGroups = makeCheckForDeliverDeliveryGroups(
      { deliverDeliveryGroups: () => undefined },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
    );

    checkForDeliverDeliveryGroups(failureTracker, emailRecipient, VALID_DELIVERY_GROUPS).catch((error) => {
      expect(error.message).toBe('No valid delivered delivery group(s) returned.');
    })
      .then(done, done);
  });
  it('should throw an error if the amount of delivery groups returned is empty', (done) => {
    const checkForDeliverDeliveryGroups = makeCheckForDeliverDeliveryGroups(
      { deliverDeliveryGroups: () => EMPTY_DELIVERY_GROUP },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
    );

    checkForDeliverDeliveryGroups(failureTracker, emailRecipient, VALID_DELIVERY_GROUPS).catch((error) => {
      expect(error.message).toBe('No valid delivered delivery group(s) returned.');
    })
      .then(done, done);
  });
  it('should throw an error if the amount of delivered delivery groups returned is empty', (done) => {
    const checkForDeliverDeliveryGroups = makeCheckForDeliverDeliveryGroups(
      { deliverDeliveryGroups: () => SUCCESSFUL_DELIVERED_DELIVERY_GROUP_STATUSES },
      { addToFailureTracker: () => failureTracker, checkMaxFailureCountReached: () => false },
    );

    checkForDeliverDeliveryGroups(failureTracker, emailRecipient, EMPTY_DELIVERY_GROUP).catch((error) => {
      expect(error.message).toBe('You must pass in one or more delivery group(s).');
    })
      .then(done, done);
  });
});
