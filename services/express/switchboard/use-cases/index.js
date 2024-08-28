const { makeCreateSwitchboard } = require('./create-switchboard');
const { makeUpdateSwitchboard } = require('./modify-switchboard');
const { makeListSwitchboard } = require('./list-switchboard');
const { makeRetrieveE2eSlotCompletionDGObsoletionBehaviour } = require('./retrieve-delivery-group-obsoletion-status');
const { makeRetrieveBugsAndTRsOnlyStatus } = require('./retrieve-bugs-or-trs-only-status');
const { makeRetrieveSlotUgFailureBehaviour } = require('./retrieve-slot-ug-failure-behaviour');
const { makeRetrieveUpgradeSlotMechanismStatus } = require('./retrieve-upgrade-slot-mechanism-status');
const { makeRetrieveNumberOfDeliveryGroups } = require('./retrieve-number-of-delivery-groups');
const { dbOperator } = require('../../data-access');
const { createSwitchboard } = require('../entities');
const { makeInitiateSwitchboard } = require('./initiate-switchboard');
const { timePeriodsService } = require('../../time-period/use-cases');

const createNewSwitchboard = makeCreateSwitchboard(dbOperator, createSwitchboard);
const modifySwitchboard = makeUpdateSwitchboard(dbOperator, createSwitchboard, timePeriodsService);
const listSwitchboard = makeListSwitchboard(dbOperator);
const retrieveE2eSlotCompletionDGObsoletionBehaviour = makeRetrieveE2eSlotCompletionDGObsoletionBehaviour(listSwitchboard);
const retrieveBugsAndTRsOnlyStatus = makeRetrieveBugsAndTRsOnlyStatus(listSwitchboard);
const retrieveSlotUgFailureBehaviour = makeRetrieveSlotUgFailureBehaviour(listSwitchboard);
const retrieveUpgradeSlotMechanismStatus = makeRetrieveUpgradeSlotMechanismStatus(listSwitchboard);
const retrieveNumberOfDeliveryGroups = makeRetrieveNumberOfDeliveryGroups(listSwitchboard);
const initiateSwitchboard = makeInitiateSwitchboard(listSwitchboard, createNewSwitchboard);

initiateSwitchboard();

const switchboardService = Object.freeze({
  createNewSwitchboard,
  modifySwitchboard,
  listSwitchboard,
  retrieveE2eSlotCompletionDGObsoletionBehaviour,
  retrieveBugsAndTRsOnlyStatus,
  retrieveSlotUgFailureBehaviour,
  retrieveUpgradeSlotMechanismStatus,
  retrieveNumberOfDeliveryGroups,
});

module.exports = {
  switchboardService,
  createNewSwitchboard,
  modifySwitchboard,
  listSwitchboard,
  retrieveE2eSlotCompletionDGObsoletionBehaviour,
  retrieveBugsAndTRsOnlyStatus,
  retrieveSlotUgFailureBehaviour,
  retrieveUpgradeSlotMechanismStatus,
  retrieveNumberOfDeliveryGroups,
};
