const { makeCommonDgObsoletionLogic } = require('./common-dg-obsoletion-logic');
const { makeOrchestrateSlotObsoletionPredictions } = require('./orchestrate-slot-obsoletion-predictions');
const { makeUgFailedAndFailureBehaviourShutdown } = require('./ug-failed-and-failure-behaviour-shutdown');
const { makeUgFailedAndFailureBehaviourObsolete } = require('./ug-failed-and-failure-behaviour-obsolete');
const { makeUgPassedAndObsoletionStatusSetToAll } = require('./ug-passed-and-obsoletion-status-set-to-all');
const { makeUgPassedAndObsoletionStatusSetToOff } = require('./ug-passed-and-obsoletion-status-set-to-off');
const { makeUgPassedAndObsoletionStatusSetToPredictions } = require('./ug-passed-and-obsoletion-status-set-to-predictions');
const { makeUgPassedAndNoTestResultsFailureBehaviourShutdown } = require('./ug-passed-and-no-test-results-failure-behaviour-shutdown');

const sendEmailService = require('./../../../../mailer/use-cases');
const deliveryGroupService = require('./../../../../delivery-group/use-cases');
const slotService = require('./../../../../slot/use-cases');
const switchboardService = require('./../../../../switchboard/use-cases');
const knownIssuesService = require('./../../../../known-issues/use-cases');

const commonDgObsoletionLogic = makeCommonDgObsoletionLogic(sendEmailService, deliveryGroupService, slotService, switchboardService);
const orchestrateSlotObsoletionPredictions = makeOrchestrateSlotObsoletionPredictions(knownIssuesService, slotService);
const ugFailedAndFailureBehaviourObsolete = makeUgFailedAndFailureBehaviourObsolete(commonDgObsoletionLogic);
const ugFailedAndFailureBehaviourShutdown = makeUgFailedAndFailureBehaviourShutdown(sendEmailService, switchboardService);
const ugPassedAndNoTestResultsFailureBehaviourShutdown = makeUgPassedAndNoTestResultsFailureBehaviourShutdown(sendEmailService, switchboardService);
const ugPassedAndObsoletionStatusSetToAll = makeUgPassedAndObsoletionStatusSetToAll(orchestrateSlotObsoletionPredictions, commonDgObsoletionLogic,
  sendEmailService, switchboardService);
const ugPassedAndObsoletionStatusSetToOff = makeUgPassedAndObsoletionStatusSetToOff(orchestrateSlotObsoletionPredictions, sendEmailService,
  switchboardService);
const ugPassedAndObsoletionStatusSetToPredictions = makeUgPassedAndObsoletionStatusSetToPredictions(orchestrateSlotObsoletionPredictions,
  commonDgObsoletionLogic, sendEmailService, switchboardService);

const slotFailureHelper = Object.freeze({
  ugFailedAndFailureBehaviourObsolete,
  ugFailedAndFailureBehaviourShutdown,
  ugPassedAndObsoletionStatusSetToAll,
  ugPassedAndObsoletionStatusSetToOff,
  ugPassedAndObsoletionStatusSetToPredictions,
  ugPassedAndNoTestResultsFailureBehaviourShutdown,
});

module.exports = { slotFailureHelper };
