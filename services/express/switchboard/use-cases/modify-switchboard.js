const logger = require('../../logger/logger');
const diff = require('./../../utils/diff');

function makeUpdateSwitchboard(switchboardDb, createSwitchboard, timePeriodsService) {
  return async function updateSwitchboard({ ...changes }) {
    const existingSwitchboard = await switchboardDb.findAll('switchboards');

    if (!existingSwitchboard) {
      throw new Error('No existing switchboard found');
    }

    const createdSwitchboard = await createSwitchboard({ ...existingSwitchboard[0], ...changes, modifiedOn: undefined });

    const updatedSwitchboard = await switchboardDb.update({
      id: createdSwitchboard.getId(),
      amtTriggerStatus: createdSwitchboard.getAmtTriggerStatus(),
      e2eSlotCompletionDGObsoletionBehaviour: createdSwitchboard.getE2eSlotCompletionDGObsoletionBehaviour(),
      bugsAndTRsOnlyStatus: createdSwitchboard.getBugsAndTRsOnlyStatus(),
      slotUgFailureBehaviour: createdSwitchboard.getSlotUgFailureBehaviour(),
      upgradeSlotMechanismStatus: createdSwitchboard.getUpgradeSlotMechanismStatus(),
      modifiedOn: createdSwitchboard.getModifiedOn(),
      numberOfDeliveryGroups: createdSwitchboard.getNumberOfDeliveryGroups(),
      lastModifiedBySignum: createdSwitchboard.getLastModifiedBySignum(),
    }, 'switchboards');

    const switchboardqueryInfo = 'Action /Patch Switchboard';
    const switchLoggingTags = { query: switchboardqueryInfo, id: createdSwitchboard.getId() };

    if (!updatedSwitchboard) {
      return existingSwitchboard;
    }

    if (changes.amtTriggerStatus) {
      logger.info(`AMT Trigger Status updated to: '${changes.amtTriggerStatus}'.`);
    }

    if (changes.amtTriggerStatus === 'on') {
      const [storedTimePeriod] = await timePeriodsService.listTimePeriod();
      if (!storedTimePeriod) {
        await timePeriodsService.createNewTimePeriod({ lengthOfTimePeriod: '00:15' });
      }
    }

    if (changes.amtTriggerStatus === 'off') {
      const [storedTimePeriod] = await timePeriodsService.listTimePeriod();
      if (storedTimePeriod) {
        await timePeriodsService.removeTimePeriod(storedTimePeriod);
      }
    }

    const tempSwitchboardObject = JSON.parse(JSON.stringify(updatedSwitchboard));
    const originalSwitchboard = JSON.parse(JSON.stringify(existingSwitchboard));

    const diffSwitchboard = diff.createDiffObject(originalSwitchboard, tempSwitchboardObject);

    switchLoggingTags.changes = diffSwitchboard;

    const lastModifiedBySignum = createdSwitchboard.getLastModifiedBySignum();

    if (changes.lastModifiedBySignum === 'AMTEL') {
      logger.info(switchLoggingTags, 'Switchboard last modified by AMTEL');
    } else {
      logger.info(switchLoggingTags, `Switchboard last modified by signum: '${lastModifiedBySignum}'.`);
    }

    changes.modifiedOn = createdSwitchboard.getModifiedOn();

    return changes;
  };
}

module.exports = { makeUpdateSwitchboard };
