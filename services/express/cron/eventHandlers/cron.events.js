const cron = require('node-cron');
const logger = require('./../../logger/logger');

const {
  checkAmtServiceToTriggerSlot,
  checkTimePeriodToTriggerSlot,
} = require('../use-cases');

cron.schedule('*/1 * * * *', async () => {
  const queryInfo = 'Action /Cron Trigger Slot';
  const loggingTags = { query: queryInfo };

  try {
    if (await checkTimePeriodToTriggerSlot()) {
      await checkAmtServiceToTriggerSlot('Cron Trigger Slot Action', 12, 10, process.env.PRODUCT_SET_CREATION_FLOW_JOB);
    }
  } catch (error) {
    logger.error(loggingTags, `${error.message}`);
  }
});
