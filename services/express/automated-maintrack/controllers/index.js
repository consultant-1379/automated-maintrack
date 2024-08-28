const { makeTriggerPostSlotActions } = require('./trigger-post-slot-actions');
const { makePopulateSlotProductSetVersion } = require('./populate-slot-product-set-version');

const {
  orchestratePostSlotActions,
  populateAmtSlotProductSetVersion,
} = require('../use-cases');

const triggerPostSlotActions = makeTriggerPostSlotActions(orchestratePostSlotActions);
const populateSlotProductSetVersion = makePopulateSlotProductSetVersion(populateAmtSlotProductSetVersion);

const automatedMaintrackController = Object.freeze({
  triggerPostSlotActions,
  populateSlotProductSetVersion,
});

module.exports = {
  automatedMaintrackController,
  triggerPostSlotActions,
  populateSlotProductSetVersion,
};
