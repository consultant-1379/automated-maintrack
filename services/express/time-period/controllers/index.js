const { makePostTimePeriod } = require('./post-time-period');
const { makeGetTimePeriod } = require('./get-time-period');
const { makeDeleteTimePeriod } = require('./delete-time-period');

const {
  createNewTimePeriod,
  removeTimePeriod,
  listTimePeriod,
} = require('../use-cases');

const postTimePeriod = makePostTimePeriod({ createNewTimePeriod });
const getTimePeriod = makeGetTimePeriod({ listTimePeriod });
const deleteTimePeriod = makeDeleteTimePeriod({ removeTimePeriod });

const timePeriodController = Object.freeze({
  postTimePeriod,
  getTimePeriod,
  deleteTimePeriod,
});

module.exports = {
  timePeriodController,
  postTimePeriod,
  getTimePeriod,
  deleteTimePeriod,
};
