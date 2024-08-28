const { makeCreateTimePeriod } = require('./create-time-period');
const { makeListTimePeriod } = require('./list-time-period');
const { makeRemoveTimePeriod } = require('./remove-time-period');
const { dbOperator } = require('../../data-access');

const { createTimePeriod } = require('../entities');

const createNewTimePeriod = makeCreateTimePeriod(dbOperator, createTimePeriod);
const listTimePeriod = makeListTimePeriod(dbOperator);
const removeTimePeriod = makeRemoveTimePeriod(dbOperator);

const timePeriodsService = Object.freeze({
  createNewTimePeriod,
  listTimePeriod,
  removeTimePeriod,
});

module.exports = {
  timePeriodsService,
  createNewTimePeriod,
  listTimePeriod,
  removeTimePeriod,
};
