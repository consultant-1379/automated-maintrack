function buildMakeSwitchboard({ Id }) {
  return function makeSwitchboard({
    id = Id.makeId(),
    amtTriggerStatus,
    e2eSlotCompletionDGObsoletionBehaviour,
    bugsAndTRsOnlyStatus,
    slotUgFailureBehaviour,
    upgradeSlotMechanismStatus,
    modifiedOn = Date.now(),
    numberOfDeliveryGroups,
    lastModifiedBySignum,
  } = {}) {
    if (!Id.isValidId(id)) {
      throw new Error('Switchboard must have a valid id.');
    }

    if (!['on', 'off'].includes(amtTriggerStatus)) {
      throw new Error('You must use either on or off for the amtTriggerStatus value');
    }

    if (!['all', 'predictions', 'off'].includes(e2eSlotCompletionDGObsoletionBehaviour)) {
      throw new Error('You must use either all, predictions or off for the e2eSlotCompletionDGObsoletionBehaviour value');
    }

    if (!['on', 'off'].includes(bugsAndTRsOnlyStatus)) {
      throw new Error('You must use either on or off for the bugsAndTRsOnlyStatus value');
    }

    if (!['shutdown', 'obsolete'].includes(slotUgFailureBehaviour)) {
      throw new Error('You must use either shutdown or obsolete for the slotUgFailureBehaviour value');
    }

    if (!['parallel', 'sequential'].includes(upgradeSlotMechanismStatus)) {
      throw new Error('You must use either parallel or sequential for the upgradeSlotMechanismStatus value');
    }

    if (numberOfDeliveryGroups !== parseInt(numberOfDeliveryGroups, 10) || numberOfDeliveryGroups < 1 || numberOfDeliveryGroups > 4) {
      throw new Error('You must enter a number between 1-4 for the numberOfDeliveryGroups value');
    }

    if (!lastModifiedBySignum) {
      throw new Error('You must provide a signum value.');
    }

    return Object.freeze({
      getId: () => id,
      getModifiedOn: () => modifiedOn,
      getAmtTriggerStatus: () => amtTriggerStatus,
      getE2eSlotCompletionDGObsoletionBehaviour: () => e2eSlotCompletionDGObsoletionBehaviour,
      getBugsAndTRsOnlyStatus: () => bugsAndTRsOnlyStatus,
      getSlotUgFailureBehaviour: () => slotUgFailureBehaviour,
      getUpgradeSlotMechanismStatus: () => upgradeSlotMechanismStatus,
      getNumberOfDeliveryGroups: () => numberOfDeliveryGroups,
      getLastModifiedBySignum: () => lastModifiedBySignum,
    });
  };
}

module.exports = { buildMakeSwitchboard };
