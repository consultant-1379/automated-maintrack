const moment = require('moment');

const { buildCheckAmtServiceToTriggerSlot } = require('./check-amt-service-to-triggering-slot');
const { buildCheckTimePeriodToTriggerSlot } = require('./check-time-period-to-trigger-slot');
const { listSwitchboard } = require('./../../switchboard/use-cases');
const { triggerUpgradeSequentialSlot } = require('./../../automated-maintrack/use-cases');
const { triggerUpgradeParallelSlot } = require('./../../automated-maintrack/use-cases');
const { makeAttemptSlotActionIfNoBlockingJob } = require('../../automated-maintrack/use-cases/attempt-slot-action-if-no-blocking-job');
const { checkIsJenkinsJobOngoing } = require('../../jenkins/use-cases');
const { timePeriodsService } = require('../../time-period/use-cases');

const checkAmtServiceToTriggerSlot = makeAttemptSlotActionIfNoBlockingJob(buildCheckAmtServiceToTriggerSlot(listSwitchboard,
  triggerUpgradeSequentialSlot, triggerUpgradeParallelSlot), checkIsJenkinsJobOngoing);
const checkTimePeriodToTriggerSlot = buildCheckTimePeriodToTriggerSlot(moment, timePeriodsService);

const cronService = {
  checkAmtServiceToTriggerSlot,
  checkTimePeriodToTriggerSlot,
};

module.exports = {
  cronService,
  checkAmtServiceToTriggerSlot,
  checkTimePeriodToTriggerSlot,
};
