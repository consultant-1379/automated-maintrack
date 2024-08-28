const cron = require('node-cron');
const logger = require('./../../logger/logger');

const { setSlotPropertiesFailedIfNecessary } = require('../use-cases');

cron.schedule('*/30 * * * *', async () => {
  const queryInfo = 'Action /Cron Slot Cleanup';
  const loggingTags = { query: queryInfo };
  try {
    await setSlotPropertiesFailedIfNecessary();
  } catch (error) {
    logger.error(loggingTags, `${error.message}`);
  }
});
