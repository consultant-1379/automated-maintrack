const expect = require('expect');

const { checkIfDeliveryGroupContainsTestware } = require('../../use-cases');

const TESTWARE_ONLY_DELIVERY_GROUP = {
  artifacts: [
    {
      category: 'testware',
      artifact: 'ERICTAFmtutils_CXP9030703',
    },
  ],
  createdByTeam: 'Thunderbee',
  deliveryGroup: '42972',
  missingDependencies: 'True',
  ccbApproved: 'True',
};

const MIXED_DELIVERY_GROUP = {
  artifacts: [
    {
      category: 'testware',
      artifact: 'ERICenmsgpmservice_CXP9031580',
    },
    {
      category: 'service',
      artifact: 'ERICpmic_CXP9030369',
    },
  ],
  createdByTeam: 'Chanakya',
  deliveryGroup: '42431',
  missingDependencies: 'False',
  ccbApproved: 'True',
};

const NON_TESTWARE_DELIVERY_GROUP = {
  artifacts: [
    {
      category: 'service',
      artifact: 'ERICshmsoftwarepackagemanagement_CXP9031632',
    },
  ],
  createdByTeam: 'Zora',
  deliveryGroup: '42979',
  missingDependencies: 'False',
  ccbApproved: 'False',
};

describe('Unit Test: Check delivery group contains testware', () => {
  it('should return true for a delivery group that contains only testware', async () => {
    const isDeliveryGroupTestware = checkIfDeliveryGroupContainsTestware(TESTWARE_ONLY_DELIVERY_GROUP);
    expect(isDeliveryGroupTestware).toBe(true);
  });
  it('should return true for a delivery group that contains one testware artifact', async () => {
    const isDeliveryGroupTestware = checkIfDeliveryGroupContainsTestware(MIXED_DELIVERY_GROUP);
    expect(isDeliveryGroupTestware).toBe(true);
  });
  it('should return false for a delivery group that does not contain testware', async () => {
    const isDeliveryGroupTestware = checkIfDeliveryGroupContainsTestware(NON_TESTWARE_DELIVERY_GROUP);
    expect(isDeliveryGroupTestware).toBe(false);
  });
});
