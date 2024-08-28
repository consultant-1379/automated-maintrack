const logger = require('./../../logger/logger');

function makeCreateSwitchboard(switchboardDb, createSwitchboard) {
  return async function addSwitchboard() {
    const currentSwitchboard = await switchboardDb.findAll('switchboards');
    if (currentSwitchboard.length > 0) {
      throw new Error('A switch already exists so not creating a new one');
    }

    const switchboard = createSwitchboard({
      amtTriggerStatus: 'off',
      e2eSlotCompletionDGObsoletionBehaviour: 'off',
      bugsAndTRsOnlyStatus: 'off',
      slotUgFailureBehaviour: 'obsolete',
      upgradeSlotMechanismStatus: 'sequential',
      numberOfDeliveryGroups: 1,
      lastModifiedBySignum: 'Jenkins User',
    });

    const switchboardqueryInfo = 'Action /Patch Switchboard';
    const switchLoggingTags = { query: switchboardqueryInfo, id: switchboard.getId() };

    const lastModifiedBySignum = switchboard.getLastModifiedBySignum();

    let lastModifiedBySignumUser = [];
    if (lastModifiedBySignum === 'AMTEL') {
      lastModifiedBySignumUser = 'AMTEL';
    } else {
      lastModifiedBySignumUser = switchboard.getLastModifiedBySignum();
    }

    const e2eSlotCompletionDGObsoletionBehaviour = switchboard.getE2eSlotCompletionDGObsoletionBehaviour();
    const bugsAndTRsOnlyStatus = switchboard.getBugsAndTRsOnlyStatus();
    const slotUgFailureBehaviour = switchboard.getSlotUgFailureBehaviour();
    const upgradeSlotMechanismStatus = switchboard.getUpgradeSlotMechanismStatus();
    const amtTriggerStatus = switchboard.getAmtTriggerStatus();
    logger.debug(switchLoggingTags, `e2eSlotCompletionDGObsoletionBehaviour = ${e2eSlotCompletionDGObsoletionBehaviour},
    bugsAndTRsOnlyStatus = ${bugsAndTRsOnlyStatus},
    slotUgFailureBehaviour = ${slotUgFailureBehaviour},
    upgradeSlotMechanismStatus = ${upgradeSlotMechanismStatus},
    amtTriggerStatus = ${amtTriggerStatus},
    lastModifiedBySignum = ${lastModifiedBySignumUser}`);

    return switchboardDb.insert({
      id: switchboard.getId(),
      amtTriggerStatus: switchboard.getAmtTriggerStatus(),
      e2eSlotCompletionDGObsoletionBehaviour: switchboard.getE2eSlotCompletionDGObsoletionBehaviour(),
      bugsAndTRsOnlyStatus: switchboard.getBugsAndTRsOnlyStatus(),
      slotUgFailureBehaviour: switchboard.getSlotUgFailureBehaviour(),
      upgradeSlotMechanismStatus: switchboard.getUpgradeSlotMechanismStatus(),
      modifiedOn: switchboard.getModifiedOn(),
      numberOfDeliveryGroups: switchboard.getNumberOfDeliveryGroups(),
      lastModifiedBySignum: switchboard.getLastModifiedBySignum(),
    }, 'switchboards');
  };
}

module.exports = { makeCreateSwitchboard };
