const logger = require('./../../logger/logger');

function makeAttemptSlotActionIfNoBlockingJob(slotAction, checkIsJenkinsJobOngoing) {
  return async function attemptSlotActionIfNoBlockingJob(slotActionLog, maxRetry, interval, blockingJob, ...args) {
    if (maxRetry < 1) return;
    const productSetCreationFlowIsOngoing = await checkIsJenkinsJobOngoing(blockingJob);
    if (!productSetCreationFlowIsOngoing) {
      return slotAction(...args);
    }
    logger.info(`Slot activity ('${slotActionLog}') was not carried out because '${blockingJob}' is ongoing \
    Will retry in ${interval} minutes. (${maxRetry} attempts remaining)`);
    if (maxRetry - 1 === 0) {
      logger.info(`Abandoning this slot action ('${slotActionLog}') due to '${blockingJob}' still ongoing after ${maxRetry * interval} minutes.`);
      return;
    }
    setTimeout(async () => {
      await attemptSlotActionIfNoBlockingJob(slotActionLog, maxRetry - 1, interval, blockingJob, ...args);
    }, interval * 60000);
  };
}

module.exports = { makeAttemptSlotActionIfNoBlockingJob };
