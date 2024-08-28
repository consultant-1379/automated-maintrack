const { buildMakeFailureTracker } = require('./failure-tracker');
const { Id } = require('../../Id');

const createFailureTracker = buildMakeFailureTracker({ Id });

module.exports = { createFailureTracker };
