const expect = require('expect');

const { makeRetrieveValidDeliveryGroups } = require('../../use-cases/retrieve-valid-delivery-groups');
const {
  checkIfDeliveryGroupContainsTestware,
  checkDgRpmVersionsHigherThanEnmBaselineVersions,
  checkIfDeliveryGroupContainsBugOrTR,
} = require('../../use-cases');


const DELIVERY_GROUPS_PORTAL_DATA = [
  {
    bugOrTR: 'True',
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
    createdByTeam: 'BladeRunners',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    bugOrTR: 'False',
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
    createdByTeam: 'Burgundy',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICenmsgfmhistory_CXP9032204',
        version: '1.32.2',
      },
    ],
    deliveryGroup: '42937',
    createdByTeam: 'Aurora',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    bugOrTR: 'True',
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
    createdByTeam: 'Vandals',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'True',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICenmsgconsaccessauth_CXP9037351',
        version: '1.1.3',
      },
    ],
    deliveryGroup: '42211',
    createdByTeam: 'Skyfall',
    missingDependencies: 'True',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICTAFmtutils_CXP9030703',
        version: '1.2.3',
      },
    ],
    createdByTeam: 'NSS_Node_Populator',
    deliveryGroup: '42972',
    missingDependencies: 'True',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICncmagent_CXP9038315',
        version: '1.9.5',
      },
    ],
    deliveryGroup: '49106',
    createdByTeam: 'NSS_Node_Populator',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICTAFmaintracktestsuite_CXP9032718',
        version: '1.2.5',
      },
    ],
    deliveryGroup: '49107',
    createdByTeam: 'NSS_Node_Populator',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFpmsubstatistical_CXP9033208',
        version: '1.69.4',
      },
    ],
    deliveryGroup: '49084',
    createdByTeam: 'Sharks',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFtorhatestautomation_CXP9030905',
        version: '1.12.1',
      },
    ],
    deliveryGroup: '42530',
    createdByTeam: 'Jupiter',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTWassertionpythonutils_CXP9034853',
        version: '1.11.1',
      },
    ],
    deliveryGroup: '42630',
    createdByTeam: 'Dhruva',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
];

const AUT_DELIVERY_GROUPS_PORTAL_DATA = [
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
    createdByTeam: 'BladeRunners',
    missingDependencies: 'False',
    ccbApproved: 'True',
    bugOrTR: 'True',
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
    createdByTeam: 'Burgundy',
    missingDependencies: 'False',
    ccbApproved: 'False',
    bugOrTR: 'True',
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
    createdByTeam: 'Aurora',
    missingDependencies: 'False',
    ccbApproved: 'True',
    bugOrTR: 'True',
  },
  {
    artifacts: [
      {
        category: 'automation',
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
    createdByTeam: 'Vandals',
    missingDependencies: 'False',
    ccbApproved: 'False',
    bugOrTR: 'True',
  },
  {
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICenmsgconsaccessauth_CXP9037351',
        version: '1.1.3',
      },
    ],
    deliveryGroup: '42211',
    createdByTeam: 'Skyfall',
    missingDependencies: 'True',
    ccbApproved: 'False',
    bugOrTR: 'True',
  },
  {
    artifacts: [
      {
        category: 'automation',
        artifact: 'ERICncmagent_CXP9038315',
        version: '1.9.5',
      },
    ],
    deliveryGroup: '49106',
    createdByTeam: 'NSS_Node_Populator',
    missingDependencies: 'False',
    ccbApproved: 'False',
    bugOrTR: 'True',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFmtutils_CXP9030703',
        version: '1.2.3',
      },
    ],
    createdByTeam: 'sharks',
    deliveryGroup: '42972',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFpmsubstatistical_CXP9033208',
        version: '1.69.4',
      },
    ],
    deliveryGroup: '49084',
    createdByTeam: 'Sharks',
    missingDependencies: 'False',
    ccbApproved: 'True',
    bugOrTR: 'True',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFmaintracktestsuite_CXP9032718',
        version: '1.2.5',
      },
    ],
    deliveryGroup: '49107',
    createdByTeam: 'NSS_Node_Populator',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
];

const EVTS_DELIVERY_GROUPS_PORTAL_DATA = [
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
    createdByTeam: 'BladeRunners',
    missingDependencies: 'False',
    ccbApproved: 'True',
    bugOrTR: 'True',
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
    createdByTeam: 'Burgundy',
    missingDependencies: 'False',
    ccbApproved: 'False',
    bugOrTR: 'True',
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
    createdByTeam: 'Aurora',
    missingDependencies: 'False',
    ccbApproved: 'True',
    bugOrTR: 'True',
  },
  {
    artifacts: [
      {
        category: 'events',
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
    createdByTeam: 'Vandals',
    missingDependencies: 'False',
    ccbApproved: 'False',
    bugOrTR: 'True',
  },
  {
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICenmsgconsaccessauth_CXP9037351',
        version: '1.1.3',
      },
    ],
    deliveryGroup: '42211',
    createdByTeam: 'Skyfall',
    missingDependencies: 'True',
    ccbApproved: 'False',
    bugOrTR: 'True',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICTAFmtutils_CXP9030703',
        version: '1.2.3',
      },
    ],
    createdByTeam: 'NSS_Node_Populator',
    deliveryGroup: '42972',
    missingDependencies: 'True',
    ccbApproved: 'True',
  },
  {
    artifacts: [
      {
        category: 'automation',
        artifact: 'ERICncmagent_CXP9038315',
        version: '1.9.5',
      },
    ],
    deliveryGroup: '49106',
    createdByTeam: 'NSS_Node_Populator',
    missingDependencies: 'False',
    ccbApproved: 'False',
    bugOrTR: 'True',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFmaintracktestsuite_CXP9032718',
        version: '1.2.5',
      },
    ],
    deliveryGroup: '49107',
    createdByTeam: 'NSS_Node_Populator',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFpmsubstatistical_CXP9033208',
        version: '1.69.4',
      },
    ],
    deliveryGroup: '49084',
    createdByTeam: 'Sharks',
    missingDependencies: 'False',
    ccbApproved: 'True',
    bugOrTR: 'True',
  },
];

const ENM_ISO_CONTENTS = [
  {
    name: 'ERICenmsgconsaccessauth_CXP9037351',
    version: '1.1.4',
  },
  {
    name: 'ERICTAFmtutils_CXP9030703',
    version: '1.2.1',
  },
  {
    name: 'ERICTAFmaintracktestsuite_CXP9032718',
    version: '1.2.1',
  },
  {
    name: 'ERICshmsoftwarepackagemanagement_CXP9031632',
    version: '1.97.3',
  },
  {
    name: 'ERICshmsoftwarepackagemanagement_CXP9031632',
    version: '1.97.3',
  },
  {
    name: 'ERICTAFshm_CXP9030703',
    version: '1.84.3',
  },
  {
    name: 'ERICenmsgfmhistory_CXP9032204',
    version: '1.32.1',
  },
  {
    name: 'ERICenmsgpmservice_CXP9031580',
    version: '1.55.1',
  },
  {
    name: 'ERICpmic_CXP9030369',
    version: '2.23.5',
  },
  {
    name: 'ERICpmicmodel_CXP9030403',
    version: '2.23.5',
  },
  {
    name: 'ERICenmsgconsaccessauth_CXP9037351',
    version: '1.1.2',
  },
];

const TESTWARE_ONLY_DELIVERY_GROUPS_PORTAL_DATA = [
  {
    bugOrTR: 'True',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICenmsgconsaccessauth_CXP9037351',
        version: '1.1.3',
      },
    ],
    createdByTeam: 'Skyfall',
    deliveryGroup: '42211',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    bugOrTR: 'True',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICenmsgpmservice_CXP9031580',
        version: '1.55.2',
      },
      {
        category: 'service',
        artifact: 'ERICpmic_CXP9030369',
        version: '2.23.6',
      },
    ],
    createdByTeam: 'Chanakya',
    deliveryGroup: '42431',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFmtutils_CXP9030703',
        version: '1.2.3',
      },
    ],
    createdByTeam: 'Thunderbee',
    deliveryGroup: '42972',
    missingDependencies: 'True',
    ccbApproved: 'True',
  },
  {
    bugOrTR: 'False',
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
    createdByTeam: 'Zora',
    deliveryGroup: '42979',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'True',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERIClinkmanagementapp_CXP9036152',
        version: '1.25.2',
      },
    ],
    createdByTeam: 'Starks',
    deliveryGroup: '42431',
    ccbApproved: 'True',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFtorhatestautomation_CXP9030905',
        version: '1.12.1',
      },
    ],
    deliveryGroup: '42530',
    createdByTeam: 'Jupiter',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTWassertionpythonutils_CXP9034853',
        version: '1.11.1',
      },
    ],
    deliveryGroup: '42630',
    createdByTeam: 'Dhruva',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
];

const VALID_DELIVERY_GROUPS_FROM_PORTAL_DATA = [
  {
    bugOrTR: 'True',
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
    createdByTeam: 'BladeRunners',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICenmsgfmhistory_CXP9032204',
        version: '1.32.2',
      },
    ],
    deliveryGroup: '42937',
    createdByTeam: 'Aurora',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    bugOrTR: 'True',
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
    createdByTeam: 'Vandals',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICncmagent_CXP9038315',
        version: '1.9.5',
      },
    ],
    deliveryGroup: '49106',
    createdByTeam: 'NSS_Node_Populator',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFpmsubstatistical_CXP9033208',
        version: '1.69.4',
      },
    ],
    deliveryGroup: '49084',
    createdByTeam: 'Sharks',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFtorhatestautomation_CXP9030905',
        version: '1.12.1',
      },
    ],
    deliveryGroup: '42530',
    createdByTeam: 'Jupiter',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'False',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTWassertionpythonutils_CXP9034853',
        version: '1.11.1',
      },
    ],
    deliveryGroup: '42630',
    createdByTeam: 'Dhruva',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
];

const VALID_AUT_DELIVERY_GROUPS_FROM_PORTAL_DATA = [
  {
    bugOrTR: 'True',
    artifacts: [
      {
        category: 'automation',
        artifact: 'ERICncmagent_CXP9038315',
        version: '1.9.5',
      },
    ],
    deliveryGroup: '49106',
    createdByTeam: 'NSS_Node_Populator',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'True',
    artifacts: [
      {
        category: 'automation',
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
    createdByTeam: 'Vandals',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
  {
    bugOrTR: 'True',
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
    createdByTeam: 'BladeRunners',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    bugOrTR: 'True',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICenmsgfmhistory_CXP9032204',
        version: '1.32.2',
      },
    ],
    deliveryGroup: '42937',
    createdByTeam: 'Aurora',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    bugOrTR: 'True',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFpmsubstatistical_CXP9033208',
        version: '1.69.4',
      },
    ],
    deliveryGroup: '49084',
    createdByTeam: 'Sharks',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
];

const VALID_EVTS_DELIVERY_GROUPS_FROM_PORTAL_DATA = [
  {
    artifacts: [
      {
        category: 'events',
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
    createdByTeam: 'Vandals',
    missingDependencies: 'False',
    ccbApproved: 'False',
    bugOrTR: 'True',
  },
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
    createdByTeam: 'BladeRunners',
    missingDependencies: 'False',
    ccbApproved: 'True',
    bugOrTR: 'True',
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
    createdByTeam: 'Aurora',
    missingDependencies: 'False',
    ccbApproved: 'True',
    bugOrTR: 'True',
  },
  {
    artifacts: [
      {
        category: 'automation',
        artifact: 'ERICncmagent_CXP9038315',
        version: '1.9.5',
      },
    ],
    deliveryGroup: '49106',
    createdByTeam: 'NSS_Node_Populator',
    missingDependencies: 'False',
    ccbApproved: 'False',
    bugOrTR: 'True',
  },
  {
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFpmsubstatistical_CXP9033208',
        version: '1.69.4',
      },
    ],
    deliveryGroup: '49084',
    createdByTeam: 'Sharks',
    missingDependencies: 'False',
    ccbApproved: 'True',
    bugOrTR: 'True',
  },
];

const VALID_BUG_OR_TR_DELIVERY_GROUPS_FROM_PORTAL_DATA = [
  {
    bugOrTR: 'True',
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
    createdByTeam: 'BladeRunners',
    missingDependencies: 'False',
    ccbApproved: 'True',
  },
  {
    bugOrTR: 'True',
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
    createdByTeam: 'Vandals',
    missingDependencies: 'False',
    ccbApproved: 'False',
  },
];

describe('Unit Test: Find valid delivery groups use case', () => {
  const filterDuplicateRpms = allDgs => allDgs;
  const filterAllDeliveryGroupsFromExclusionTeamList = allDgs => allDgs;
  it('should not get a DG, which is marked as missing dependencies as true', async () => {
    const testEnvironmentMock = { name: '346', clusterType: 'any' };
    const useExternalApiMock = {
      getLatestDrop: () => null,
      getLatestEnmIsoVersion: () => null,
      getPackagesInEnmIso: () => ENM_ISO_CONTENTS,
      getPackagesInEnmTestwareIso: () => [],
    };
    const retrieveBugsAndTRsOnlyStatusMock = () => 'off';
    const retrieveListOfExcludedTeamsNamesMock = {
      retrieveListOfExcludedTeamsNames: () => [],
    };
    const decideOnDgCategoryAndTestEnvironmentToPickMock = {
      decideOnDgCategoryAndTestEnvironmentToPick: () => testEnvironmentMock,
    };
    const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(
      checkIfDeliveryGroupContainsTestware,
      checkIfDeliveryGroupContainsBugOrTR,
      retrieveBugsAndTRsOnlyStatusMock,
      checkDgRpmVersionsHigherThanEnmBaselineVersions,
      useExternalApiMock,
      decideOnDgCategoryAndTestEnvironmentToPickMock.decideOnDgCategoryAndTestEnvironmentToPick,
      filterDuplicateRpms,
      retrieveListOfExcludedTeamsNamesMock.retrieveListOfExcludedTeamsNames,
      filterAllDeliveryGroupsFromExclusionTeamList,
    );

    const queuedDeliveryGroups = await retrieveValidDeliveryGroups(DELIVERY_GROUPS_PORTAL_DATA, 10, {
      candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
      candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
      candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
    });
    expect(queuedDeliveryGroups.validDeliveryGroups).toBeDefined();
    expect(queuedDeliveryGroups.testEnvironment).toBeDefined();
    expect(queuedDeliveryGroups.validDeliveryGroups.length).toBeGreaterThan(0);
    expect(queuedDeliveryGroups.validDeliveryGroups).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          deliveryGroup: '42211',
        }),
      ]),
    );
  });
  it('should not get a DG, which contains testware and CCB approved marked as false except for ADU and APTU RPMs', async () => {
    const testEnvironmentMock = { name: '346', clusterType: 'any' };
    const useExternalApiMock = {
      getLatestDrop: () => null,
      getLatestEnmIsoVersion: () => null,
      getPackagesInEnmIso: () => ENM_ISO_CONTENTS,
      getPackagesInEnmTestwareIso: () => [],
    };
    const retrieveBugsAndTRsOnlyStatusMock = () => 'off';
    const retrieveListOfExcludedTeamsNamesMock = {
      retrieveListOfExcludedTeamsNames: () => [],
    };
    const decideOnDgCategoryAndTestEnvironmentToPickMock = {
      decideOnDgCategoryAndTestEnvironmentToPick: () => testEnvironmentMock,
    };
    const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(
      checkIfDeliveryGroupContainsTestware,
      checkIfDeliveryGroupContainsBugOrTR,
      retrieveBugsAndTRsOnlyStatusMock,
      checkDgRpmVersionsHigherThanEnmBaselineVersions,
      useExternalApiMock,
      decideOnDgCategoryAndTestEnvironmentToPickMock.decideOnDgCategoryAndTestEnvironmentToPick,
      filterDuplicateRpms,
      retrieveListOfExcludedTeamsNamesMock.retrieveListOfExcludedTeamsNames,
      filterAllDeliveryGroupsFromExclusionTeamList,
    );
    const queuedDeliveryGroups = await retrieveValidDeliveryGroups(DELIVERY_GROUPS_PORTAL_DATA, 10, {
      candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
      candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
      candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
    });
    expect(queuedDeliveryGroups.validDeliveryGroups).toBeDefined();
    expect(queuedDeliveryGroups.testEnvironment).toBeDefined();
    expect(queuedDeliveryGroups.validDeliveryGroups.length).toBeGreaterThan(0);
    expect(queuedDeliveryGroups.validDeliveryGroups).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          deliveryGroup: '42979',
        }),
      ]),
    );
  });
  it('should return an object of delivery groups', async () => {
    const testEnvironmentMock = { name: '346', clusterType: 'any' };
    const useExternalApiMock = {
      getLatestDrop: () => null,
      getLatestEnmIsoVersion: () => null,
      getPackagesInEnmIso: () => ENM_ISO_CONTENTS,
      getPackagesInEnmTestwareIso: () => [],
    };
    const retrieveBugsAndTRsOnlyStatusMock = () => 'off';
    const retrieveListOfExcludedTeamsNamesMock = {
      retrieveListOfExcludedTeamsNames: () => [],
    };
    const decideOnDgCategoryAndTestEnvironmentToPickMock = {
      decideOnDgCategoryAndTestEnvironmentToPick: () => testEnvironmentMock,
    };
    const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(
      checkIfDeliveryGroupContainsTestware,
      checkIfDeliveryGroupContainsBugOrTR,
      retrieveBugsAndTRsOnlyStatusMock,
      checkDgRpmVersionsHigherThanEnmBaselineVersions,
      useExternalApiMock,
      decideOnDgCategoryAndTestEnvironmentToPickMock.decideOnDgCategoryAndTestEnvironmentToPick,
      filterDuplicateRpms,
      retrieveListOfExcludedTeamsNamesMock.retrieveListOfExcludedTeamsNames,
      filterAllDeliveryGroupsFromExclusionTeamList,
    );
    const queuedDeliveryGroups = await retrieveValidDeliveryGroups(DELIVERY_GROUPS_PORTAL_DATA, 10, {
      candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
      candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
      candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
    });
    expect(queuedDeliveryGroups.validDeliveryGroups).toEqual(VALID_DELIVERY_GROUPS_FROM_PORTAL_DATA);
  });
  it('should continue looking for a non testware delivery group if all the delivery groups it got were testware', async () => {
    const testEnvironmentMock = { name: '346', clusterType: 'any' };
    const useExternalApiMock = {
      getLatestDrop: () => null,
      getLatestEnmIsoVersion: () => null,
      getPackagesInEnmIso: () => ENM_ISO_CONTENTS,
      getPackagesInEnmTestwareIso: () => [],
    };
    const retrieveBugsAndTRsOnlyStatusMock = () => 'off';
    const retrieveListOfExcludedTeamsNamesMock = {
      retrieveListOfExcludedTeamsNames: () => [],
    };
    const decideOnDgCategoryAndTestEnvironmentToPickMock = {
      decideOnDgCategoryAndTestEnvironmentToPick: () => testEnvironmentMock,
    };
    const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(
      checkIfDeliveryGroupContainsTestware,
      checkIfDeliveryGroupContainsBugOrTR,
      retrieveBugsAndTRsOnlyStatusMock,
      checkDgRpmVersionsHigherThanEnmBaselineVersions,
      useExternalApiMock,
      decideOnDgCategoryAndTestEnvironmentToPickMock.decideOnDgCategoryAndTestEnvironmentToPick,
      filterDuplicateRpms,
      retrieveListOfExcludedTeamsNamesMock.retrieveListOfExcludedTeamsNames,
      filterAllDeliveryGroupsFromExclusionTeamList,
    );
    const queuedDeliveryGroups = await retrieveValidDeliveryGroups(DELIVERY_GROUPS_PORTAL_DATA, 1, {
      candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
      candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
      candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
    });
    expect(queuedDeliveryGroups.validDeliveryGroups).toEqual([
      {
        artifacts: [
          {
            category: 'service',
            artifact: 'ERICenmsgfmhistory_CXP9032204',
            version: '1.32.2',
          },
        ],
        bugOrTR: 'False',
        deliveryGroup: '42937',
        createdByTeam: 'Aurora',
        missingDependencies: 'False',
        ccbApproved: 'True',
      }]);
  });
  it('should return 2 delivery groups if no. passed in 2', async () => {
    const testEnvironmentMock = { name: '346', clusterType: 'any' };
    const useExternalApiMock = {
      getLatestDrop: () => null,
      getLatestEnmIsoVersion: () => null,
      getPackagesInEnmIso: () => ENM_ISO_CONTENTS,
      getPackagesInEnmTestwareIso: () => [],
    };
    const retrieveBugsAndTRsOnlyStatusMock = () => 'off';
    const retrieveListOfExcludedTeamsNamesMock = {
      retrieveListOfExcludedTeamsNames: () => [],
    };
    const decideOnDgCategoryAndTestEnvironmentToPickMock = {
      decideOnDgCategoryAndTestEnvironmentToPick: () => testEnvironmentMock,
    };
    const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(
      checkIfDeliveryGroupContainsTestware,
      checkIfDeliveryGroupContainsBugOrTR,
      retrieveBugsAndTRsOnlyStatusMock,
      checkDgRpmVersionsHigherThanEnmBaselineVersions,
      useExternalApiMock,
      decideOnDgCategoryAndTestEnvironmentToPickMock.decideOnDgCategoryAndTestEnvironmentToPick,
      filterDuplicateRpms,
      retrieveListOfExcludedTeamsNamesMock.retrieveListOfExcludedTeamsNames,
      filterAllDeliveryGroupsFromExclusionTeamList,
    );
    const queuedDeliveryGroups = await retrieveValidDeliveryGroups(DELIVERY_GROUPS_PORTAL_DATA, 2, {
      candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
      candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
      candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
    });
    expect(queuedDeliveryGroups.validDeliveryGroups.length).toBe(2);
  });
  it('should check the order (oldest to newest) of the delivery groups in the queue', async () => {
    const testEnvironmentMock = { name: '346', clusterType: 'any' };
    const useExternalApiMock = {
      getLatestDrop: () => null,
      getLatestEnmIsoVersion: () => null,
      getPackagesInEnmIso: () => ENM_ISO_CONTENTS,
      getPackagesInEnmTestwareIso: () => [],
    };
    const retrieveBugsAndTRsOnlyStatusMock = () => 'off';
    const retrieveListOfExcludedTeamsNamesMock = {
      retrieveListOfExcludedTeamsNames: () => [],
    };
    const decideOnDgCategoryAndTestEnvironmentToPickMock = {
      decideOnDgCategoryAndTestEnvironmentToPick: () => testEnvironmentMock,
    };
    const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(
      checkIfDeliveryGroupContainsTestware,
      checkIfDeliveryGroupContainsBugOrTR,
      retrieveBugsAndTRsOnlyStatusMock,
      checkDgRpmVersionsHigherThanEnmBaselineVersions,
      useExternalApiMock,
      decideOnDgCategoryAndTestEnvironmentToPickMock.decideOnDgCategoryAndTestEnvironmentToPick,
      filterDuplicateRpms,
      retrieveListOfExcludedTeamsNamesMock.retrieveListOfExcludedTeamsNames,
      filterAllDeliveryGroupsFromExclusionTeamList,
    );
    const queuedDeliveryGroups = await retrieveValidDeliveryGroups(DELIVERY_GROUPS_PORTAL_DATA, 10, {
      candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
      candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
      candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
    });
    expect(queuedDeliveryGroups.validDeliveryGroups).toBeDefined();
    expect(queuedDeliveryGroups.validDeliveryGroups.length).toBeGreaterThan(0);
    expect(queuedDeliveryGroups.validDeliveryGroups[0].deliveryGroup).toContain('42430');
    expect(queuedDeliveryGroups.validDeliveryGroups[queuedDeliveryGroups.validDeliveryGroups.length - 1].deliveryGroup).toContain('42630');
  });
  it('should say there are 0 valid delivery groups as they are all testware', async () => {
    const testEnvironmentMock = { name: '346', clusterType: 'any' };
    const useExternalApiMock = {
      getLatestDrop: () => null,
      getLatestEnmIsoVersion: () => null,
      getPackagesInEnmIso: () => ENM_ISO_CONTENTS,
      getPackagesInEnmTestwareIso: () => [],
    };
    const retrieveBugsAndTRsOnlyStatusMock = () => 'off';
    const retrieveListOfExcludedTeamsNamesMock = {
      retrieveListOfExcludedTeamsNames: () => [],
    };
    const decideOnDgCategoryAndTestEnvironmentToPickMock = {
      decideOnDgCategoryAndTestEnvironmentToPick: () => testEnvironmentMock,
    };
    const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(
      checkIfDeliveryGroupContainsTestware,
      checkIfDeliveryGroupContainsBugOrTR,
      retrieveBugsAndTRsOnlyStatusMock,
      checkDgRpmVersionsHigherThanEnmBaselineVersions,
      useExternalApiMock,
      decideOnDgCategoryAndTestEnvironmentToPickMock.decideOnDgCategoryAndTestEnvironmentToPick,
      filterDuplicateRpms,
      retrieveListOfExcludedTeamsNamesMock.retrieveListOfExcludedTeamsNames,
      filterAllDeliveryGroupsFromExclusionTeamList,
    );
    const queuedDeliveryGroups = await retrieveValidDeliveryGroups(TESTWARE_ONLY_DELIVERY_GROUPS_PORTAL_DATA, 3, {
      candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
      candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
      candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
    });
    expect(queuedDeliveryGroups.validDeliveryGroups).toBeDefined();
    expect(queuedDeliveryGroups.validDeliveryGroups.length).toBe(0);
  });
  it('should not get a DG, which is is lower version than what is already in ENM ISO', async () => {
    const testEnvironmentMock = { name: '346', clusterType: 'any' };
    const useExternalApiMock = {
      getLatestDrop: () => null,
      getLatestEnmIsoVersion: () => null,
      getPackagesInEnmIso: () => [
        {
          name: 'ERICncmagent_CXP9038315',
          version: '1.9.6',
        },
      ],
      getPackagesInEnmTestwareIso: () => [],
    };
    const retrieveBugsAndTRsOnlyStatusMock = () => 'off';
    const retrieveListOfExcludedTeamsNamesMock = {
      retrieveListOfExcludedTeamsNames: () => [],
    };
    const decideOnDgCategoryAndTestEnvironmentToPickMock = {
      decideOnDgCategoryAndTestEnvironmentToPick: () => testEnvironmentMock,
    };
    const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(
      checkIfDeliveryGroupContainsTestware,
      checkIfDeliveryGroupContainsBugOrTR,
      retrieveBugsAndTRsOnlyStatusMock,
      checkDgRpmVersionsHigherThanEnmBaselineVersions,
      useExternalApiMock,
      decideOnDgCategoryAndTestEnvironmentToPickMock.decideOnDgCategoryAndTestEnvironmentToPick,
      filterDuplicateRpms,
      retrieveListOfExcludedTeamsNamesMock.retrieveListOfExcludedTeamsNames,
      filterAllDeliveryGroupsFromExclusionTeamList,
    );
    const queuedDeliveryGroups = await retrieveValidDeliveryGroups(DELIVERY_GROUPS_PORTAL_DATA, 10, {
      candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
      candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
      candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
    });
    expect(queuedDeliveryGroups.validDeliveryGroups).toBeDefined();
    expect(queuedDeliveryGroups.validDeliveryGroups.length).toBeGreaterThan(0);
    expect(queuedDeliveryGroups.validDeliveryGroups).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          deliveryGroup: '49106',
        }),
      ]),
    );
  });
  it('should not get a testware DG, which is is lower version than what is already in ENM Testware ISO', async () => {
    const testEnvironmentMock = { name: '346', clusterType: 'any' };
    const useExternalApiMock = {
      getLatestDrop: () => null,
      getLatestEnmIsoVersion: () => null,
      getPackagesInEnmIso: () => [],
      getPackagesInEnmTestwareIso: () => [
        {
          name: 'ERICTAFpmsubstatistical_CXP9033208',
          version: '1.69.5',
        },
      ],
    };
    const retrieveBugsAndTRsOnlyStatusMock = () => 'off';
    const retrieveListOfExcludedTeamsNamesMock = {
      retrieveListOfExcludedTeamsNames: () => [],
    };
    const decideOnDgCategoryAndTestEnvironmentToPickMock = {
      decideOnDgCategoryAndTestEnvironmentToPick: () => testEnvironmentMock,
    };
    const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(
      checkIfDeliveryGroupContainsTestware,
      checkIfDeliveryGroupContainsBugOrTR,
      retrieveBugsAndTRsOnlyStatusMock,
      checkDgRpmVersionsHigherThanEnmBaselineVersions,
      useExternalApiMock,
      decideOnDgCategoryAndTestEnvironmentToPickMock.decideOnDgCategoryAndTestEnvironmentToPick,
      filterDuplicateRpms,
      retrieveListOfExcludedTeamsNamesMock.retrieveListOfExcludedTeamsNames,
      filterAllDeliveryGroupsFromExclusionTeamList,
    );
    const queuedDeliveryGroups = await retrieveValidDeliveryGroups(DELIVERY_GROUPS_PORTAL_DATA, 10, {
      candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
      candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
      candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
    });
    expect(queuedDeliveryGroups.validDeliveryGroups).toBeDefined();
    expect(queuedDeliveryGroups.validDeliveryGroups.length).toBeGreaterThan(0);
    expect(queuedDeliveryGroups.validDeliveryGroups).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          deliveryGroup: '49084',
        }),
      ]),
    );
  });
  it('should return an object of delivery groups in order of automation DGs prioritised', async () => {
    const testEnvironmentMock = { name: '297', clusterType: 'automation' };
    const useExternalApiMock = {
      getLatestDrop: () => null,
      getLatestEnmIsoVersion: () => null,
      getPackagesInEnmIso: () => ENM_ISO_CONTENTS,
      getPackagesInEnmTestwareIso: () => [],
    };
    const retrieveBugsAndTRsOnlyStatusMock = () => 'off';
    const retrieveListOfExcludedTeamsNamesMock = {
      retrieveListOfExcludedTeamsNames: () => [],
    };
    const decideOnDgCategoryAndTestEnvironmentToPickMock = {
      decideOnDgCategoryAndTestEnvironmentToPick: () => testEnvironmentMock,
    };
    const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(
      checkIfDeliveryGroupContainsTestware,
      checkIfDeliveryGroupContainsBugOrTR,
      retrieveBugsAndTRsOnlyStatusMock,
      checkDgRpmVersionsHigherThanEnmBaselineVersions,
      useExternalApiMock,
      decideOnDgCategoryAndTestEnvironmentToPickMock.decideOnDgCategoryAndTestEnvironmentToPick,
      filterDuplicateRpms,
      retrieveListOfExcludedTeamsNamesMock.retrieveListOfExcludedTeamsNames,
      filterAllDeliveryGroupsFromExclusionTeamList,
    );
    const queuedDeliveryGroups = await retrieveValidDeliveryGroups(AUT_DELIVERY_GROUPS_PORTAL_DATA, 10, {
      candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
      candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
      candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
    });
    expect(queuedDeliveryGroups.validDeliveryGroups).toEqual(VALID_AUT_DELIVERY_GROUPS_FROM_PORTAL_DATA);
  });
  it('should return an object of delivery groups in order of events DGs prioritised', async () => {
    const testEnvironmentMock = { name: '339', clusterType: 'events' };
    const useExternalApiMock = {
      getLatestDrop: () => null,
      getLatestEnmIsoVersion: () => null,
      getPackagesInEnmIso: () => ENM_ISO_CONTENTS,
      getPackagesInEnmTestwareIso: () => [],
    };
    const retrieveBugsAndTRsOnlyStatusMock = () => 'off';
    const retrieveListOfExcludedTeamsNamesMock = {
      retrieveListOfExcludedTeamsNames: () => [],
    };
    const decideOnDgCategoryAndTestEnvironmentToPickMock = {
      decideOnDgCategoryAndTestEnvironmentToPick: () => testEnvironmentMock,
    };
    const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(
      checkIfDeliveryGroupContainsTestware,
      checkIfDeliveryGroupContainsBugOrTR,
      retrieveBugsAndTRsOnlyStatusMock,
      checkDgRpmVersionsHigherThanEnmBaselineVersions,
      useExternalApiMock,
      decideOnDgCategoryAndTestEnvironmentToPickMock.decideOnDgCategoryAndTestEnvironmentToPick,
      filterDuplicateRpms,
      retrieveListOfExcludedTeamsNamesMock.retrieveListOfExcludedTeamsNames,
      filterAllDeliveryGroupsFromExclusionTeamList,
    );
    const queuedDeliveryGroups = await retrieveValidDeliveryGroups(EVTS_DELIVERY_GROUPS_PORTAL_DATA, 10, {
      candidatePhysicalVersioningTestEnvironment: { name: '346', clusterType: 'any' },
      candidatePhysicalAutTestEnvironment: { name: '297', clusterType: 'automation' },
      candidatePhysicalEvtsTestEnvironment: { name: '339', clusterType: 'events' },
    });
    expect(queuedDeliveryGroups.validDeliveryGroups).toEqual(VALID_EVTS_DELIVERY_GROUPS_FROM_PORTAL_DATA);
  });
  it('should get only DGs with bugs and trs when the bugsAndTRsOnlyStatus switch is on.', async () => {
    const testEnvironmentMock = { name: '339', clusterType: 'events' };
    const useExternalApiMock = {
      getLatestDrop: () => null,
      getLatestEnmIsoVersion: () => null,
      getPackagesInEnmIso: () => ENM_ISO_CONTENTS,
      getPackagesInEnmTestwareIso: () => [],
    };
    const retrieveBugsAndTRsOnlyStatusMock = () => 'on';
    const retrieveListOfExcludedTeamsNamesMock = {
      retrieveListOfExcludedTeamsNames: () => [],
    };
    const decideOnDgCategoryAndTestEnvironmentToPickMock = {
      decideOnDgCategoryAndTestEnvironmentToPick: () => testEnvironmentMock,
    };
    const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(
      checkIfDeliveryGroupContainsTestware,
      checkIfDeliveryGroupContainsBugOrTR,
      retrieveBugsAndTRsOnlyStatusMock,
      checkDgRpmVersionsHigherThanEnmBaselineVersions,
      useExternalApiMock,
      decideOnDgCategoryAndTestEnvironmentToPickMock.decideOnDgCategoryAndTestEnvironmentToPick,
      filterDuplicateRpms,
      retrieveListOfExcludedTeamsNamesMock.retrieveListOfExcludedTeamsNames,
      filterAllDeliveryGroupsFromExclusionTeamList,
    );
    const queuedDeliveryGroups = await retrieveValidDeliveryGroups(DELIVERY_GROUPS_PORTAL_DATA, 10);
    expect(queuedDeliveryGroups.validDeliveryGroups).toEqual(VALID_BUG_OR_TR_DELIVERY_GROUPS_FROM_PORTAL_DATA);
  });
  it('should return all valid delivery groups whether its a bug, TR or not when the bugsAndTRsOnlyStatus switch is off.', async () => {
    const testEnvironmentMock = { name: '339', clusterType: 'events' };
    const useExternalApiMock = {
      getLatestDrop: () => null,
      getLatestEnmIsoVersion: () => null,
      getPackagesInEnmIso: () => ENM_ISO_CONTENTS,
      getPackagesInEnmTestwareIso: () => [],
    };
    const retrieveBugsAndTRsOnlyStatusMock = () => 'off';
    const retrieveListOfExcludedTeamsNamesMock = {
      retrieveListOfExcludedTeamsNames: () => [],
    };
    const decideOnDgCategoryAndTestEnvironmentToPickMock = {
      decideOnDgCategoryAndTestEnvironmentToPick: () => testEnvironmentMock,
    };
    const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(
      checkIfDeliveryGroupContainsTestware,
      checkIfDeliveryGroupContainsBugOrTR,
      retrieveBugsAndTRsOnlyStatusMock,
      checkDgRpmVersionsHigherThanEnmBaselineVersions,
      useExternalApiMock,
      decideOnDgCategoryAndTestEnvironmentToPickMock.decideOnDgCategoryAndTestEnvironmentToPick,
      filterDuplicateRpms,
      retrieveListOfExcludedTeamsNamesMock.retrieveListOfExcludedTeamsNames,
      filterAllDeliveryGroupsFromExclusionTeamList,
    );
    const queuedDeliveryGroups = await retrieveValidDeliveryGroups(DELIVERY_GROUPS_PORTAL_DATA, 10);
    expect(queuedDeliveryGroups.validDeliveryGroups).toEqual(VALID_DELIVERY_GROUPS_FROM_PORTAL_DATA);
  });
});
