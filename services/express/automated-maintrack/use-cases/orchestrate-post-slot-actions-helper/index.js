const { makeSlotOngoingOrNoDeliveryGroups } = require('./slot-ongoing-or-no-delivery-groups');
const { makeSlotSuccessful } = require('./slot-successful');
const { makeSlotFailure } = require('./slot-failure');

const { sendEmailService } = require('../../../mailer/use-cases');
const { switchboardService } = require('../../../switchboard/use-cases');
const { slotFailureHelper } = require('./slot-failure-helper');

const slotOngoingOrNoDeliveryGroups = makeSlotOngoingOrNoDeliveryGroups();
const slotSuccessful = makeSlotSuccessful(sendEmailService);
const slotFailure = makeSlotFailure(slotFailureHelper, switchboardService);

const orchestratePostSlotActionsHelper = Object.freeze({
  slotOngoingOrNoDeliveryGroups,
  slotSuccessful,
  slotFailure,
});

module.exports = {
  orchestratePostSlotActionsHelper,
};
