const { makeAddToFailureTracker } = require('./add-to-failure-tracker');
const { makeCheckMaxFailureCountReached } = require('./check-max-failure-count-reached');
const { makeCreateFailureTracker } = require('./create-failure-tracker');
const { makeListFailureTracker } = require('./list-failure-tracker');
const { makeResetFailureTracker } = require('./reset-failure-tracker');
const { makeUpdateFailureTracker } = require('./update-failure-tracker');
const { dbOperator } = require('../../data-access');

const { createFailureTracker } = require('../entities');

const createNewFailureTracker = makeCreateFailureTracker(dbOperator, createFailureTracker);
const listFailureTracker = makeListFailureTracker(dbOperator);
const updateFailureTracker = makeUpdateFailureTracker(dbOperator, createFailureTracker, listFailureTracker);
const addToFailureTracker = makeAddToFailureTracker(updateFailureTracker);
const checkMaxFailureCountReached = makeCheckMaxFailureCountReached();
const resetFailureTracker = makeResetFailureTracker(updateFailureTracker);

const failureTrackerService = Object.freeze({
  createNewFailureTracker,
  updateFailureTracker,
  listFailureTracker,
  addToFailureTracker,
  checkMaxFailureCountReached,
  resetFailureTracker,
});

module.exports = {
  failureTrackerService,
  createNewFailureTracker,
  updateFailureTracker,
  listFailureTracker,
  addToFailureTracker,
  checkMaxFailureCountReached,
  resetFailureTracker,
};
