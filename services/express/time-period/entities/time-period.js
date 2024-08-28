function buildMakeTimePeriod({ Id, moment }) {
  return function makeTimePeriod({
    id = Id.makeId(),
    lengthOfTimePeriod,
    timePeriodStart,
    timePeriodEnd,
  } = {}) {
    if (!timePeriodStart) {
      timePeriodStart = moment();
    }

    if (!Id.isValidId(id)) {
      throw new Error('Time Period must have a valid id.');
    }

    if (!/[-]?\d+:[-]?\d+/.test(lengthOfTimePeriod)) {
      throw new Error('Time Period must be of the format HOURS:MINUTES in number format.');
    }

    const [hours, minutes] = lengthOfTimePeriod.split(':').map(time => Number(time));

    if (hours > 999 || hours < 0 || minutes > 999 || minutes < 0) {
      throw new Error('Time Period must not be greater than 999 or less than 0.');
    }

    if (hours === 0 && minutes === 0) {
      throw new Error('Time Period must not have both hours and minutes equal to zero.');
    }

    if (!timePeriodEnd) {
      timePeriodEnd = moment().add(hours, 'hour').add(minutes, 'minute');
    }

    return Object.freeze({
      getlengthOfTimePeriod: () => lengthOfTimePeriod,
      getId: () => id,
      getTimePeriodStart: () => timePeriodStart,
      getTimePeriodEnd: () => timePeriodEnd,
    });
  };
}

module.exports = { buildMakeTimePeriod };
