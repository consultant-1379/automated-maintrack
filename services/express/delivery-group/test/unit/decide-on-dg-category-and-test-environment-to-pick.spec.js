const expect = require('expect');

const { makeDecideOnDgCategoryAndTestEnvironmentToPick } = require('../../use-cases/decide-on-dg-category-and-test-environment-to-pick');

const DELIVERY_GROUPS_PORTAL_DATA = [
  {
    artifacts: [
      {
        category: 'service',
        artifact: 'ERIClinkmanagementapp_CXP9036152',
        version: '1.26.1',
      },
      {
        category: 'testware',
        artifact: 'ERIClinkmanagementapp_CXP9036152',
        version: '1.26.1',
      },
    ],
    deliveryGroup: '42430',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
];

const VERSIONING_DELIVERY_GROUPS_PORTAL_DATA = [
  {
    artifacts: [
      {
        category: 'service',
        artifact: 'ERIClinkmanagementapp_CXP9036152',
        version: '1.26.1',
      },
      {
        category: 'testware',
        artifact: 'ERIClinkmanagementapp_CXP9036152',
        version: '1.26.1',
      },
    ],
    deliveryGroup: '42430',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICshmsoftwarepackagemanagement_CXP9031632',
        version: '1.97.4',
      },
      {
        category: 'testware',
        artifact: 'ERICTAFshm_CXP9030703',
        version: '1.84.6',
      },
    ],
    deliveryGroup: '42979',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICenmsgfmhistory_CXP9032204',
        version: '1.32.2',
      },
    ],
    deliveryGroup: '42937',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICenmsgpmservice_CXP9031580',
        version: '1.55.2',
      },
      {
        category: 'service',
        artifact: 'ERICpmic_CXP9030369',
        version: '2.23.6',
      },
      {
        category: 'model',
        artifact: 'ERICpmicmodel_CXP9030403',
        version: '2.23.6',
      },
    ],
    deliveryGroup: '42431',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'services',
        artifact: 'ERICenmsgconsaccessauth_CXP9037351',
        version: '1.1.3',
      },
    ],
    deliveryGroup: '42211',
    missingDependencies: 'True',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'services',
        artifact: 'ERICncmagent_CXP9038315',
        version: '1.9.5',
      },
    ],
    deliveryGroup: '49106',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'services',
        artifact: 'ERICTAFpmsubstatistical_CXP9033208',
        version: '1.69.4',
      },
    ],
    deliveryGroup: '49084',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
];

const AUT_DELIVERY_GROUPS_PORTAL_DATA = [
  {
    artifacts: [
      {
        category: 'automation',
        artifact: 'ERIClinkmanagementapp_CXP9036152',
        version: '1.26.1',
      },
      {
        category: 'testware',
        artifact: 'ERIClinkmanagementapp_CXP9036152',
        version: '1.26.1',
      },
    ],
    deliveryGroup: '42430',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICshmsoftwarepackagemanagement_CXP9031632',
        version: '1.97.4',
      },
      {
        category: 'testware',
        artifact: 'ERICTAFshm_CXP9030703',
        version: '1.84.6',
      },
    ],
    deliveryGroup: '42979',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'automation',
        artifact: 'ERICenmsgfmhistory_CXP9032204',
        version: '1.32.2',
      },
    ],
    deliveryGroup: '42937',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    artifacts: [
      {
        category: 'service, automation',
        artifact: 'ERICenmsgpmservice_CXP9031580',
        version: '1.55.2',
      },
      {
        category: 'service',
        artifact: 'ERICpmic_CXP9030369',
        version: '2.23.6',
      },
      {
        category: 'model',
        artifact: 'ERICpmicmodel_CXP9030403',
        version: '2.23.6',
      },
    ],
    deliveryGroup: '42431',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'services',
        artifact: 'ERICenmsgconsaccessauth_CXP9037351',
        version: '1.1.3',
      },
    ],
    deliveryGroup: '42211',
    missingDependencies: 'True',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'events',
        artifact: 'ERICncmagent_CXP9038315',
        version: '1.9.5',
      },
    ],
    deliveryGroup: '49106',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'services',
        artifact: 'ERICTAFpmsubstatistical_CXP9033208',
        version: '1.69.4',
      },
    ],
    deliveryGroup: '49084',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
];

const EVT_DELIVERY_GROUPS_PORTAL_DATA = [
  {
    artifacts: [
      {
        category: 'events',
        artifact: 'ERIClinkmanagementapp_CXP9036152',
        version: '1.26.1',
      },
      {
        category: 'testware',
        artifact: 'ERIClinkmanagementapp_CXP9036152',
        version: '1.26.1',
      },
    ],
    deliveryGroup: '42430',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICshmsoftwarepackagemanagement_CXP9031632',
        version: '1.97.4',
      },
      {
        category: 'testware',
        artifact: 'ERICTAFshm_CXP9030703',
        version: '1.84.6',
      },
    ],
    deliveryGroup: '42979',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'events',
        artifact: 'ERICenmsgfmhistory_CXP9032204',
        version: '1.32.2',
      },
    ],
    deliveryGroup: '42937',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    artifacts: [
      {
        category: 'service, automation',
        artifact: 'ERICenmsgpmservice_CXP9031580',
        version: '1.55.2',
      },
      {
        category: 'service',
        artifact: 'ERICpmic_CXP9030369',
        version: '2.23.6',
      },
      {
        category: 'model',
        artifact: 'ERICpmicmodel_CXP9030403',
        version: '2.23.6',
      },
    ],
    deliveryGroup: '42431',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'services',
        artifact: 'ERICenmsgconsaccessauth_CXP9037351',
        version: '1.1.3',
      },
    ],
    deliveryGroup: '42211',
    missingDependencies: 'True',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'events',
        artifact: 'ERICncmagent_CXP9038315',
        version: '1.9.5',
      },
    ],
    deliveryGroup: '49106',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'services',
        artifact: 'ERICTAFpmsubstatistical_CXP9033208',
        version: '1.69.4',
      },
    ],
    deliveryGroup: '49084',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
];

const EVEN_DELIVERY_GROUPS_PORTAL_DATA = [
  {
    artifacts: [
      {
        category: 'events',
        artifact: 'ERIClinkmanagementapp_CXP9036152',
        version: '1.26.1',
      },
      {
        category: 'testware',
        artifact: 'ERIClinkmanagementapp_CXP9036152',
        version: '1.26.1',
      },
    ],
    deliveryGroup: '42430',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICshmsoftwarepackagemanagement_CXP9031632',
        version: '1.97.4',
      },
      {
        category: 'testware',
        artifact: 'ERICTAFshm_CXP9030703',
        version: '1.84.6',
      },
    ],
    deliveryGroup: '42979',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'automation',
        artifact: 'ERICenmsgfmhistory_CXP9032204',
        version: '1.32.2',
      },
    ],
    deliveryGroup: '42937',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    artifacts: [
      {
        category: 'service, automation',
        artifact: 'ERICenmsgpmservice_CXP9031580',
        version: '1.55.2',
      },
      {
        category: 'service',
        artifact: 'ERICpmic_CXP9030369',
        version: '2.23.6',
      },
      {
        category: 'model',
        artifact: 'ERICpmicmodel_CXP9030403',
        version: '2.23.6',
      },
    ],
    deliveryGroup: '42431',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'services',
        artifact: 'ERICenmsgconsaccessauth_CXP9037351',
        version: '1.1.3',
      },
    ],
    deliveryGroup: '42211',
    missingDependencies: 'True',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'events',
        artifact: 'ERICncmagent_CXP9038315',
        version: '1.9.5',
      },
    ],
    deliveryGroup: '49106',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'services',
        artifact: 'ERICTAFpmsubstatistical_CXP9033208',
        version: '1.69.4',
      },
    ],
    deliveryGroup: '49084',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
];

const VERSIONING_TEST_ENVIRONMENT = {
  candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
  candidatePhysicalAutTestEnvironment: { name: '', clusterType: 'automation' },
  candidatePhysicalEvtsTestEnvironment: { name: '', clusterType: 'events' },
};

const VERSIONING_AND_AUT_TEST_ENVIRONMENTS = {
  candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
  candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
  candidatePhysicalEvtsTestEnvironment: { name: '', clusterType: 'events' },
};

const VERSIONING_AND_EVT_TEST_ENVIRONMENTS = {
  candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
  candidatePhysicalAutTestEnvironment: { name: '', clusterType: 'automation' },
  candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
};

const TEST_ENVIRONMENTS = {
  candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
  candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
  candidatePhysicalEvtsTestEnvironment: { name: '343', clusterType: 'events' },
};

const AUT_AND_EVT_TEST_ENVIRONMENTS = {
  candidatePhysicalVersioningTestEnvironment: { name: '', clusterType: 'any' },
  candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
  candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
};

const AUT_TEST_ENVIRONMENT = {
  candidatePhysicalVersioningTestEnvironment: { name: '', clusterType: 'any' },
  candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
  candidatePhysicalEvtsTestEnvironment: { name: '', clusterType: 'events' },
};

const EVT_TEST_ENVIRONMENT = {
  candidatePhysicalVersioningTestEnvironment: { name: '', clusterType: 'any' },
  candidatePhysicalAutTestEnvironment: { name: '', clusterType: 'automation' },
  candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
};

describe('Unit Test: Decide on DG category and test environment to pick', () => {
  it('should return the versioning test environment', () => {
    const decideOnDgCategoryAndTestEnvironmentToPick = makeDecideOnDgCategoryAndTestEnvironmentToPick();
    const testEnvironmentDgCategoryData = decideOnDgCategoryAndTestEnvironmentToPick(DELIVERY_GROUPS_PORTAL_DATA,
      VERSIONING_TEST_ENVIRONMENT);
    expect(testEnvironmentDgCategoryData).toEqual(VERSIONING_TEST_ENVIRONMENT.candidatePhysicalVersioningTestEnvironment);
  });
  it('should return the automation test environment 1', () => {
    const decideOnDgCategoryAndTestEnvironmentToPick = makeDecideOnDgCategoryAndTestEnvironmentToPick();
    const testEnvironmentDgCategoryData = decideOnDgCategoryAndTestEnvironmentToPick(DELIVERY_GROUPS_PORTAL_DATA,
      VERSIONING_AND_AUT_TEST_ENVIRONMENTS);
    expect(testEnvironmentDgCategoryData).toEqual(VERSIONING_AND_AUT_TEST_ENVIRONMENTS.candidatePhysicalAutTestEnvironment);
  });
  it('should return the automation test environment 2', () => {
    const decideOnDgCategoryAndTestEnvironmentToPick = makeDecideOnDgCategoryAndTestEnvironmentToPick();
    const testEnvironmentDgCategoryData = decideOnDgCategoryAndTestEnvironmentToPick(EVT_DELIVERY_GROUPS_PORTAL_DATA,
      AUT_TEST_ENVIRONMENT);
    expect(testEnvironmentDgCategoryData).toEqual(AUT_TEST_ENVIRONMENT.candidatePhysicalAutTestEnvironment);
  });
  it('should return the events test environment 1', () => {
    const decideOnDgCategoryAndTestEnvironmentToPick = makeDecideOnDgCategoryAndTestEnvironmentToPick();
    const testEnvironmentDgCategoryData = decideOnDgCategoryAndTestEnvironmentToPick(DELIVERY_GROUPS_PORTAL_DATA,
      VERSIONING_AND_EVT_TEST_ENVIRONMENTS);
    expect(testEnvironmentDgCategoryData).toEqual(VERSIONING_AND_EVT_TEST_ENVIRONMENTS.candidatePhysicalEvtsTestEnvironment);
  });
  it('should return the events test environment 2', () => {
    const decideOnDgCategoryAndTestEnvironmentToPick = makeDecideOnDgCategoryAndTestEnvironmentToPick();
    const testEnvironmentDgCategoryData = decideOnDgCategoryAndTestEnvironmentToPick(AUT_DELIVERY_GROUPS_PORTAL_DATA,
      EVT_TEST_ENVIRONMENT);
    expect(testEnvironmentDgCategoryData).toEqual(EVT_TEST_ENVIRONMENT.candidatePhysicalEvtsTestEnvironment);
  });
  it('should return the versioning test environment if automation and events DGs are zero and versioning name test environment exists', () => {
    const decideOnDgCategoryAndTestEnvironmentToPick = makeDecideOnDgCategoryAndTestEnvironmentToPick();
    const testEnvironmentDgCategoryData = decideOnDgCategoryAndTestEnvironmentToPick(VERSIONING_DELIVERY_GROUPS_PORTAL_DATA,
      TEST_ENVIRONMENTS);
    expect(testEnvironmentDgCategoryData).toEqual(TEST_ENVIRONMENTS.candidatePhysicalVersioningTestEnvironment);
  });
  it('should return the automation test environment as automation DG count is highest', () => {
    const decideOnDgCategoryAndTestEnvironmentToPick = makeDecideOnDgCategoryAndTestEnvironmentToPick();
    const testEnvironmentDgCategoryData = decideOnDgCategoryAndTestEnvironmentToPick(AUT_DELIVERY_GROUPS_PORTAL_DATA,
      TEST_ENVIRONMENTS);
    expect(testEnvironmentDgCategoryData).toEqual(TEST_ENVIRONMENTS.candidatePhysicalAutTestEnvironment);
  });
  it('should return the events test environment as events DG count is highest', () => {
    const decideOnDgCategoryAndTestEnvironmentToPick = makeDecideOnDgCategoryAndTestEnvironmentToPick();
    const testEnvironmentDgCategoryData = decideOnDgCategoryAndTestEnvironmentToPick(EVT_DELIVERY_GROUPS_PORTAL_DATA,
      TEST_ENVIRONMENTS);
    expect(testEnvironmentDgCategoryData).toEqual(TEST_ENVIRONMENTS.candidatePhysicalEvtsTestEnvironment);
  });
  it('should return either automation and events test environment as DG count is the same 1', () => {
    const decideOnDgCategoryAndTestEnvironmentToPick = makeDecideOnDgCategoryAndTestEnvironmentToPick();
    const testEnvironmentDgCategoryData = decideOnDgCategoryAndTestEnvironmentToPick(EVEN_DELIVERY_GROUPS_PORTAL_DATA,
      TEST_ENVIRONMENTS);
    expect([TEST_ENVIRONMENTS.candidatePhysicalEvtsTestEnvironment.name,
      TEST_ENVIRONMENTS.candidatePhysicalAutTestEnvironment.name]).toContain(testEnvironmentDgCategoryData.name);
  });
  it('should return either automation and events test environment as DG count is the same 2', () => {
    const decideOnDgCategoryAndTestEnvironmentToPick = makeDecideOnDgCategoryAndTestEnvironmentToPick();
    const testEnvironmentDgCategoryData = decideOnDgCategoryAndTestEnvironmentToPick(EVEN_DELIVERY_GROUPS_PORTAL_DATA,
      AUT_AND_EVT_TEST_ENVIRONMENTS);
    expect([AUT_AND_EVT_TEST_ENVIRONMENTS.candidatePhysicalEvtsTestEnvironment.name,
      AUT_AND_EVT_TEST_ENVIRONMENTS.candidatePhysicalAutTestEnvironment.name]).toContain(testEnvironmentDgCategoryData.name);
  });
  it('should return either automation and events test environment as DG count is the same 3', () => {
    const decideOnDgCategoryAndTestEnvironmentToPick = makeDecideOnDgCategoryAndTestEnvironmentToPick();
    const testEnvironmentDgCategoryData = decideOnDgCategoryAndTestEnvironmentToPick(EVEN_DELIVERY_GROUPS_PORTAL_DATA,
      AUT_TEST_ENVIRONMENT);
    expect(testEnvironmentDgCategoryData).toEqual(AUT_TEST_ENVIRONMENT.candidatePhysicalAutTestEnvironment);
  });
  it('should return either automation and events test environment as DG count is the same 4', () => {
    const decideOnDgCategoryAndTestEnvironmentToPick = makeDecideOnDgCategoryAndTestEnvironmentToPick();
    const testEnvironmentDgCategoryData = decideOnDgCategoryAndTestEnvironmentToPick(EVEN_DELIVERY_GROUPS_PORTAL_DATA,
      EVT_TEST_ENVIRONMENT);
    expect(testEnvironmentDgCategoryData).toEqual(EVT_TEST_ENVIRONMENT.candidatePhysicalEvtsTestEnvironment);
  });
});
