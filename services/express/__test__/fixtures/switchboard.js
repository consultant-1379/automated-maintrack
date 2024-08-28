const faker = require('faker');
const cuid = require('cuid');

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

function makeFakeSwitchboard(overrides) {
  const validOnOffStatusOptions = ['on', 'off'];
  const validObsoletionStatusOptions = ['all', 'predictions', 'off'];
  const validBugsAndTRsOnlyStatusOptions = ['on', 'off'];
  const validSlotUgFailureBehaviourOptions = ['shutdown', 'obsolete'];
  const validUpgradeSlotMechanismStatus = ['parallel', 'sequential'];
  const validLastModifiedBySignum = ['eaaaaa'];
  const switchboard = {
    id: Id.makeId(),
    amtTriggerStatus: faker.random.arrayElement(validOnOffStatusOptions),
    e2eSlotCompletionDGObsoletionBehaviour: faker.random.arrayElement(validObsoletionStatusOptions),
    bugsAndTRsOnlyStatus: faker.random.arrayElement(validBugsAndTRsOnlyStatusOptions),
    slotUgFailureBehaviour: faker.random.arrayElement(validSlotUgFailureBehaviourOptions),
    upgradeSlotMechanismStatus: faker.random.arrayElement(validUpgradeSlotMechanismStatus),
    numberOfDeliveryGroups: faker.random.number({
      min: 1,
      max: 4,
    }),
    lastModifiedBySignum: faker.random.arrayElement(validLastModifiedBySignum),
  };

  return {
    ...switchboard,
    ...overrides,
  };
}

module.exports = { makeFakeSwitchboard };
