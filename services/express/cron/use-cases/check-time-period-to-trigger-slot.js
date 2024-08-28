const logger = require('../../logger/logger');

function buildCheckTimePeriodToTriggerSlot(moment, timePeriodsService) {
  return async function checkTimePeriodToTriggerSlot() {
    const [storedTimePeriod] = await timePeriodsService.listTimePeriod();
    if (!storedTimePeriod) return;
    if (moment().isSameOrAfter(moment(storedTimePeriod.timePeriodEnd._d), 'minutes')) {
      logger.info('Attempting to kick off a slot and updating time period.');
      await timePeriodsService.createNewTimePeriod({ lengthOfTimePeriod: storedTimePeriod.lengthOfTimePeriod });
      await timePeriodsService.removeTimePeriod(storedTimePeriod);
      return true;
    }
  };
}

module.exports = { buildCheckTimePeriodToTriggerSlot };
