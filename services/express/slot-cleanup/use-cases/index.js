const { buildSetSlotsFailedIfNecessary } = require('./set-slots-failed-if-necessary');

const { slotService } = require('./../../slot/use-cases');
const { testEnvironmentService } = require('./../../test-environments/use-cases');
const { sendEmailService } = require('../../mailer/use-cases');

const setSlotPropertiesFailedIfNecessary = buildSetSlotsFailedIfNecessary(slotService, testEnvironmentService, sendEmailService);

module.exports = { setSlotPropertiesFailedIfNecessary };
