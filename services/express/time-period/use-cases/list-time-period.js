function makeListTimePeriod(timePeriodDb) {
  return async function listTimePeriod() {
    return timePeriodDb.findAll('timePeriod');
  };
}

module.exports = { makeListTimePeriod };
