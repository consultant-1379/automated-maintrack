function makeRemoveTimePeriod(timePeriodDb) {
  return async function removeTimePeriod(timePeriodId) {
    if (!timePeriodId.id) {
      throw new Error('You must specify a id.');
    }
    return timePeriodDb.remove({
      id: timePeriodId.id,
    }, 'timePeriod');
  };
}

module.exports = { makeRemoveTimePeriod };
