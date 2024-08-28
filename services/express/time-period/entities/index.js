const moment = require('moment');
const { buildMakeTimePeriod } = require('./time-period');
const { Id } = require('./../../Id');

const createTimePeriod = buildMakeTimePeriod({ Id, moment });

module.exports = { createTimePeriod };
