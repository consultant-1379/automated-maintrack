require('../../config/config');

const faker = require('faker');
const cuid = require('cuid');

const GERRIT_AMT = process.env.GERRIT_AUTOMATED_MAINTRACK;

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

function makeFakeSlot(overrides) {
  const validStatusOptions = [
    ['failure', 'failure', 'success'],
    ['success', 'success', 'success'],
    ['ongoing', 'failure', 'ongoing'],
    ['ongoing', 'ongoing', 'success'],
    ['failure', 'failure', 'failure'],
    ['success', 'success', 'success'],
  ];
  const validBugsAndTRsOnlyStatusOptions = ['on', 'off'];
  const validSlotUgFailureBehaviourOptions = ['shutdown', 'obsolete'];
  const validDeliveryGroups = [
    [
      {
        createdByTeam: 'Strikers',
        deliveryGroupId: '44154',
        includedCategories: 'ms,common,cloudtemplate',
        typeOfDelivery: 'auto',
        deliveredRpms: [{
          name: 'ERICstrike_CXP9034650',
          category: 'ms',
          version: '1.1.12',
        },
        {
          name: 'ERICstrike2_CXP9034650',
          category: 'common',
          version: '2.3.1',
        }],
      },
    ],
    [
      {
        createdByTeam: 'Trigger',
        deliveryGroupId: '44183',
        includedCategories: 'ms',
        typeOfDelivery: 'auto',
        deliveredRpms: [{
          name: 'ERICtrigger_CXP9030570',
          category: 'ms',
          version: '4.3.6',
        }],
      },
      {
        createdByTeam: 'Aztec',
        deliveryGroupId: '44195',
        includedCategories: 'service,model,testware',
        typeOfDelivery: 'auto',
        deliveredRpms: [{
          name: 'ERICazte_CXP9030890',
          category: 'service',
          version: '1.5.9',
        }],
      },
    ],
    [
      {
        createdByTeam: 'Vulcanians',
        deliveryGroupId: '44194',
        includedCategories: 'service',
        typeOfDelivery: 'auto',
        deliveredRpms: [{
          name: 'ERICvulcan_CXP9030570',
          category: 'service',
          version: '1.3.12',
        }],
      },
    ],
  ];

  const validPhysicalFailedJobUrlOptions = [
    '',
    'https://fem4s11-eiffel004.eiffel.gic.ericsson.se:8443/jenkins/job/MTE_Physical_Test_Upgrade_Assertions_Flow/4439/',
    'https://fem4s11-eiffel004.eiffel.gic.ericsson.se:8443/jenkins/job/MTE_Physical_Test_Upgrade_Assertions_Flow/4445/',
  ];

  const validCloudFailedJobUrlOptions = [
    '',
    'https://fem4s11-eiffel004.eiffel.gic.ericsson.se:8443/jenkins/job/MTE_vENM_Post_UG_Acceptance_Tests/2058/',
    'https://fem4s11-eiffel004.eiffel.gic.ericsson.se:8443/jenkins/job/MTE_vENM_Post_UG_Acceptance_Tests/2057/',
  ];

  const validRfa250UrlOptions = [
    '',
    `${GERRIT_AMT};a=blob_plain;f=services/express/mocked-json/RFA250/e50dd017-1d18-4fac-8282-e74ebf75012f.json;hb=refs/heads/master`,
    `${GERRIT_AMT};a=blob_plain;f=services/express/mocked-json/RFA250/2308bd5b-8234-4e9e-8089-3d6cfc56ece6.json;hb=refs/heads/master`,
    `${GERRIT_AMT};a=blob_plain;f=services/express/mocked-json/RFA250/6ccb0424-03f4-4ebd-9f20-4378efbfabc4.json;hb=refs/heads/master`,
  ];

  const validAptuUrlOptions = [
    '',
    `${GERRIT_AMT};a=blob_plain;f=services/express/mocked-json/APTU/699_20201116T230208.json;hb=refs/heads/master`,
    `${GERRIT_AMT};a=blob_plain;f=services/express/mocked-json/APTU/294_20201116T200805.json;hb=refs/heads/master`,
    `${GERRIT_AMT};a=blob_plain;f=services/express/mocked-json/APTU/344_20201117T043028.json;hb=refs/heads/master`,
  ];

  const validAduUrlOptions = [
    '',
    `${GERRIT_AMT};a=blob_plain;f=services/express/mocked-json/ADU/d2996224-ad58-4f93-bd16-b5900ab5f39e.json;hb=refs/heads/master`,
    `${GERRIT_AMT};a=blob_plain;f=services/express/mocked-json/ADU/3f370446-94a7-47e1-9a6d-c4bde62085e7.json;hb=refs/heads/master`,
    `${GERRIT_AMT};a=blob_plain;f=services/express/mocked-json/ADU/29f2ace1-7bd8-4db7-8a65-0782e9fd6695.json;hb=refs/heads/master`,
  ];

  const validPhysicalUpgradeStatusOptions = [
    '',
    'failure',
  ];

  const validCloudUpgradeStatusOptions = [
    '',
    'failure',
  ];

  const validSlotNumber = [
    'first',
    'second',
  ];

  const randomStatusOptions = faker.random.arrayElement(validStatusOptions);
  const randomDeliveryGroups = faker.random.arrayElement(validDeliveryGroups);
  const randomRfa250Url = faker.random.arrayElement(validRfa250UrlOptions);
  const randomAptuUrl = faker.random.arrayElement(validAptuUrlOptions);
  const randomAduUrl = faker.random.arrayElement(validAduUrlOptions);
  const randomPhysicalFailedJobUrl = faker.random.arrayElement(validPhysicalFailedJobUrlOptions);
  const randomCloudFailedJobUrl = faker.random.arrayElement(validCloudFailedJobUrlOptions);
  const randomProductSet = `${faker.random.number(99)}.${faker.random.number(99)}.${faker.random.number(999)}`;
  const randomBugsAndTRsOnlyStatus = faker.random.arrayElement(validBugsAndTRsOnlyStatusOptions);
  const randomSlotUgFailureBehaviour = faker.random.arrayElement(validSlotUgFailureBehaviourOptions);
  const randomPhysicalUpgradeStatus = faker.random.arrayElement(validPhysicalUpgradeStatusOptions);
  const randomCloudUpgradeStatus = faker.random.arrayElement(validCloudUpgradeStatusOptions);
  const randomSlotNumber = faker.random.arrayElement(validSlotNumber);
  const slot = {
    id: Id.makeId(),
    slotStatus: randomStatusOptions[0],
    physicalEnvironment: faker.name.findName(),
    cloudEnvironment: faker.name.findName(),
    deliveredDGs: randomDeliveryGroups,
    obsoletedDGs: [],
    dgObsoletionPredictions: [],
    bugsAndTRsOnlyStatus: randomBugsAndTRsOnlyStatus,
    slotUgFailureBehaviour: randomSlotUgFailureBehaviour,
    productSetVersion: randomProductSet,
    physicalStatus: randomStatusOptions[1],
    cloudStatus: randomStatusOptions[2],
    physicalUpgradeStatus: randomPhysicalUpgradeStatus,
    cloudUpgradeStatus: randomCloudUpgradeStatus,
    physicalFailedJobUrl: randomPhysicalFailedJobUrl,
    cloudFailedJobUrl: randomCloudFailedJobUrl,
    rfa250Url: randomRfa250Url,
    aptuUrl: randomAptuUrl,
    aduUrl: randomAduUrl,
    slotType: 'automatic',
    createdOn: Date.now(),
    slotNumber: randomSlotNumber,
  };

  return {
    ...slot,
    ...overrides,
  };
}

module.exports = { makeFakeSlot };
