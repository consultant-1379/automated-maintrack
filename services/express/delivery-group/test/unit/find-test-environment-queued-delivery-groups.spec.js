const expect = require('expect');
const { makeFindTestEnvironmentQueuedDeliveryGroups } = require('../../use-cases/find-test-environment-queued-delivery-groups');

const VALID_DELIVERY_GROUPS = [
  {
    autoCreated: 'False',
    parentElement: 'AssuranceAndOptimisation',
    artifacts:
      [{
        category: 'service',
        artifact: 'ERICalarmcontroldisplaygui_CXP9031026',
        dateCreated: '2020-05-18 08:45:52',
        version: '1.98.3',
        vmServices: [Array],
        groupId: 'com.ericsson.oss.presentation.client.fm.alarmcontroldisplaygui',
      }],
    bugOrTR: 'True',
    component: '101',
    missingDependencies: 'False',
    createdByTeam: 'Dhruva',
    deliveryGroup: '44580',
    modifiedDate: '2020-05-18 10:29:29',
    createdDate: '2020-05-18 10:29:29',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'PlanningAndConfiguration',
    artifacts:
      [{
        category: 'service',
        artifact: 'ERICshminventory_CXP9031631',
        dateCreated: '2020-05-18 08:41:35',
        version: '1.95.2',
        vmServices: [Array],
        groupId: 'com.ericsson.oss.services.shm',
      }],
    bugOrTR: 'True',
    component: '112',
    missingDependencies: 'False',
    createdByTeam: 'Trident',
    deliveryGroup: '44581',
    modifiedDate: '2020-05-18 10:42:14',
    createdDate: '2020-05-18 10:42:14',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'PlanningAndConfiguration',
    artifacts:
      [{
        category: 'service',
        artifact: 'ERICshmlicensemanagement_CXP9031634',
        dateCreated: '2020-05-18 11:14:50',
        version: '1.91.1',
        vmServices: [Array],
        groupId: 'com.ericsson.oss.services.shm',
      }],
    bugOrTR: 'True',
    component: '112',
    missingDependencies: 'False',
    createdByTeam: 'Trident',
    deliveryGroup: '44584',
    modifiedDate: '2020-05-18 12:27:22',
    createdDate: '2020-05-18 12:27:22',
    ccbApproved: 'False',
  },
];

const EXPECTED_VALID_DELIVERY_GROUPS = [{
  createdByTeam: 'Dhruva',
  deliveryGroupId: '44580',
  includedCategories: 'service',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    category: 'service',
    name: 'ERICalarmcontroldisplaygui_CXP9031026',
    version: '1.98.3',
  }],
},
{
  createdByTeam: 'Trident',
  deliveryGroupId: '44581',
  includedCategories: 'service',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    category: 'service',
    name: 'ERICshminventory_CXP9031631',
    version: '1.95.2',
  }],
},
{
  createdByTeam: 'Trident',
  deliveryGroupId: '44584',
  includedCategories: 'service',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    category: 'service',
    name: 'ERICshmlicensemanagement_CXP9031634',
    version: '1.91.1',
  }],
}];

const EXPECTED_SINGLE_VALID_DELIVERY_GROUP = [{
  createdByTeam: 'Dhruva',
  deliveryGroupId: '44580',
  includedCategories: 'service',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    category: 'service',
    name: 'ERICalarmcontroldisplaygui_CXP9031026',
    version: '1.98.3',
  }],
}];

const TEST_ENVIRONMENTS = {
  candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
  candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
  candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
};

describe('Unit Test: Find queued delivery groups use case', () => {
  it('should throw error if negative delivery groups needed is passed in', (done) => {
    const findTestEnvironmentQueuedDeliveryGroups = makeFindTestEnvironmentQueuedDeliveryGroups(null, null);
    findTestEnvironmentQueuedDeliveryGroups(-2, '20.05', TEST_ENVIRONMENTS).catch(async (error) => {
      expect(error.message).toBe('Number of delivery groups needed must be a positive and also must be of type number');
    }).then(done, done);
  });
  it('should throw error if 0 delivery groups needed is passed in', (done) => {
    const findTestEnvironmentQueuedDeliveryGroups = makeFindTestEnvironmentQueuedDeliveryGroups(null, null);
    findTestEnvironmentQueuedDeliveryGroups(0, '20.05', TEST_ENVIRONMENTS).catch(async (error) => {
      expect(error.message).toBe('Number of delivery groups needed must be a positive and also must be of type number');
    }).then(done, done);
  });
  it('should throw error if no delivery groups needed is passed in', (done) => {
    const findTestEnvironmentQueuedDeliveryGroups = makeFindTestEnvironmentQueuedDeliveryGroups(null, null);
    findTestEnvironmentQueuedDeliveryGroups(null, '20.05', TEST_ENVIRONMENTS).catch(async (error) => {
      expect(error.message).toBe('Number of delivery groups needed must be a positive and also must be of type number');
    }).then(done, done);
  });
  it('should return an invalid delivery group as no valid delivery groups were found', async () => {
    const validTestEnvironmentAndQueuedDeliveryGroupsMock = {
      validDeliveryGroups: [],
      testEnvironment: { name: '297', clusterType: 'any' },
    };
    const findTestEnvironmentQueuedDeliveryGroups = makeFindTestEnvironmentQueuedDeliveryGroups({
      useExternalApi: {
        getQueuedDeliveryGroups: () => ({
          reverse: () => null,
        }),
      },
    },
    () => validTestEnvironmentAndQueuedDeliveryGroupsMock);
    const testEnvironmentAndDeliveryGroups = await findTestEnvironmentQueuedDeliveryGroups(3, '20.05', TEST_ENVIRONMENTS);
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups[0].error).toBe('No Delivery Groups');
  });
  it('should return a list of three delivery groups', async () => {
    const validTestEnvironmentAndQueuedDeliveryGroupsMock = {
      validDeliveryGroups: VALID_DELIVERY_GROUPS,
      testEnvironment: { name: '297', clusterType: 'any' },
    };
    const findTestEnvironmentQueuedDeliveryGroups = makeFindTestEnvironmentQueuedDeliveryGroups({
      useExternalApi: {
        getQueuedDeliveryGroups: () => ({
          reverse: () => null,
        }),
      },
    }, () => validTestEnvironmentAndQueuedDeliveryGroupsMock);
    const testEnvironmentAndDeliveryGroups = await findTestEnvironmentQueuedDeliveryGroups(3, '20.05', TEST_ENVIRONMENTS);
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups.length).toBe(3);
    expect(testEnvironmentAndDeliveryGroups.testEnvironment.name).toEqual('297');
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups).toEqual(EXPECTED_VALID_DELIVERY_GROUPS);
  });
  it('should return a list of one delivery groups despite passing 3 as the number of delivery groups needed', async () => {
    const validTestEnvironmentAndQueuedDeliveryGroupsMock = {
      validDeliveryGroups: [VALID_DELIVERY_GROUPS[0]],
      testEnvironment: { name: '297', clusterType: 'any' },
    };
    const findTestEnvironmentQueuedDeliveryGroups = makeFindTestEnvironmentQueuedDeliveryGroups({
      useExternalApi: {
        getQueuedDeliveryGroups: () => ({
          reverse: () => null,
        }),
      },
    }, () => validTestEnvironmentAndQueuedDeliveryGroupsMock);
    const testEnvironmentAndDeliveryGroups = await findTestEnvironmentQueuedDeliveryGroups(3, '20.05', TEST_ENVIRONMENTS);
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups.length).toBe(1);
    expect(testEnvironmentAndDeliveryGroups.testEnvironment.name).toEqual('297');
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups).toEqual(EXPECTED_SINGLE_VALID_DELIVERY_GROUP);
  });
});
