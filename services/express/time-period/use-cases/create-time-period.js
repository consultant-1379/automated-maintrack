function makeCreateTimePeriod(timePeriodDb, createTimePeriod) {
  return async function addTimePeriod(timePeriodInfo) {
    const timePeriod = createTimePeriod(timePeriodInfo);
    return timePeriodDb.insert({
      id: timePeriod.getId(),
      lengthOfTimePeriod: timePeriod.getlengthOfTimePeriod(),
      timePeriodStart: timePeriod.getTimePeriodStart(),
      timePeriodEnd: timePeriod.getTimePeriodEnd(),
    }, 'timePeriod');
  };
}

module.exports = { makeCreateTimePeriod };
