const expect = require('expect');
const { useExternalApiService } = require('../../../external-apis');
const { findTestEnvironmentQueuedDeliveryGroups } = require('../../use-cases');

const TEST_ENVIRONMENTS = {
  candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
  candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
  candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
};

describe('Integration Test: Find queued delivery groups use case', () => {
  it('should successfully get queued delivery groups', async () => {
    const latestDrop = await useExternalApiService.useExternalApi.getLatestDrop();
    const testEnvironmentAndDeliveryGroups = await findTestEnvironmentQueuedDeliveryGroups(1, latestDrop, TEST_ENVIRONMENTS);
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups.length).toBe(1);
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups[0].createdByTeam).toBeTruthy();
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups[0].deliveryGroupId).toBeTruthy();
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups[0].includedCategories).toBeTruthy();
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups[0].includedCategories).toEqual(expect.not.stringMatching('testware'));
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups[0].typeOfDelivery).toEqual('auto');
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups[0].deliveredRpms.length).toBeGreaterThanOrEqual(1);
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups[0].deliveredRpms[0].name).toBeTruthy();
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups[0].deliveredRpms[0].category).toBeTruthy();
    expect(testEnvironmentAndDeliveryGroups.queuedDeliveryGroups[0].deliveredRpms[0].version).toBeTruthy();
    expect(testEnvironmentAndDeliveryGroups.testEnvironment.name).toBeTruthy();
  });
});
