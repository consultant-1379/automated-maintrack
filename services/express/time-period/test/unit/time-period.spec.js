const expect = require('expect');

const { makeFakeTimePeriod } = require('../../../__test__/fixtures/timePeriod');
const { createTimePeriod } = require('../../entities');

describe('Unit Test: TimePeriod entity', () => {
  it('must have a valid id', () => {
    const timePeriod = makeFakeTimePeriod({ id: 'invalid' });
    expect(() => createTimePeriod(timePeriod)).toThrow('Time Period must have a valid id.');
    const noId = makeFakeTimePeriod({ id: undefined, lengthOfTimePeriod: '1:0' });
    expect(() => createTimePeriod(noId)).not.toThrow();
  });

  it('can create an id if no id passed in', () => {
    const noId = makeFakeTimePeriod({ id: undefined });
    const timePeriod = createTimePeriod(noId);
    expect(timePeriod.getId()).toBeDefined();
  });

  it('must have valid time format passed in 1', () => {
    const invalidLengthOfTimePeriod = makeFakeTimePeriod({ lengthOfTimePeriod: 'A:12' });
    expect(() => createTimePeriod(invalidLengthOfTimePeriod)).toThrow('Time Period must be of the format HOURS:MINUTES in number format.');
  });

  it('must have valid time format passed in 2', () => {
    const invalidLengthOfTimePeriod = makeFakeTimePeriod({ lengthOfTimePeriod: '1:A' });
    expect(() => createTimePeriod(invalidLengthOfTimePeriod)).toThrow('Time Period must be of the format HOURS:MINUTES in number format.');
  });

  it('must have valid time format passed in 3', () => {
    const invalidLengthOfTimePeriod = makeFakeTimePeriod({ lengthOfTimePeriod: 'e:1' });
    expect(() => createTimePeriod(invalidLengthOfTimePeriod)).toThrow('Time Period must be of the format HOURS:MINUTES in number format.');
  });

  it('must not have the lengthOfTime greater than 999 1', () => {
    const invalidLengthOfTimePeriod = makeFakeTimePeriod({ lengthOfTimePeriod: '1000:0' });
    expect(() => createTimePeriod(invalidLengthOfTimePeriod)).toThrow('Time Period must not be greater than 999 or less than 0.');
  });

  it('must not have the lengthOfTime greater than 999 2', () => {
    const invalidLengthOfTimePeriod = makeFakeTimePeriod({ lengthOfTimePeriod: '0:1000' });
    expect(() => createTimePeriod(invalidLengthOfTimePeriod)).toThrow('Time Period must not be greater than 999 or less than 0.');
  });

  it('must not have the lengthOfTime less than than 0 1', () => {
    const invalidLengthOfTimePeriod = makeFakeTimePeriod({ lengthOfTimePeriod: '0:-1' });
    expect(() => createTimePeriod(invalidLengthOfTimePeriod)).toThrow('Time Period must not be greater than 999 or less than 0.');
  });

  it('must not have the lengthOfTime less than than 0 2', () => {
    const invalidLengthOfTimePeriod = makeFakeTimePeriod({ lengthOfTimePeriod: '-1:0' });
    expect(() => createTimePeriod(invalidLengthOfTimePeriod)).toThrow('Time Period must not be greater than 999 or less than 0.');
  });

  it('must not have both lengthOfTime values equal to 0', () => {
    const invalidLengthOfTimePeriod = makeFakeTimePeriod({ lengthOfTimePeriod: '0:0' });
    expect(() => createTimePeriod(invalidLengthOfTimePeriod)).toThrow('Time Period must not have both hours and minutes equal to zero.');
  });

  it('must not have the lengthOfTime in a falsy value 1', () => {
    const invalidLengthOfTimePeriod = makeFakeTimePeriod({ lengthOfTimePeriod: undefined });
    expect(() => createTimePeriod(invalidLengthOfTimePeriod)).toThrow('Time Period must be of the format HOURS:MINUTES in number format.');
  });

  it('must not have the lengthOfTime in a falsy value 2', () => {
    const invalidLengthOfTimePeriod = makeFakeTimePeriod({ lengthOfTimePeriod: null });
    expect(() => createTimePeriod(invalidLengthOfTimePeriod)).toThrow('Time Period must be of the format HOURS:MINUTES in number format.');
  });

  it('must not have the lengthOfTime in a falsy value 3', () => {
    const invalidLengthOfTimePeriod = makeFakeTimePeriod({ lengthOfTimePeriod: '' });
    expect(() => createTimePeriod(invalidLengthOfTimePeriod)).toThrow('Time Period must be of the format HOURS:MINUTES in number format.');
  });

  it('must not have the lengthOfTime in a falsy value 4', () => {
    const invalidLengthOfTimePeriod = makeFakeTimePeriod({ lengthOfTimePeriod: 0 });
    expect(() => createTimePeriod(invalidLengthOfTimePeriod)).toThrow('Time Period must be of the format HOURS:MINUTES in number format.');
  });

  it('must not have the lengthOfTime in a falsy value 5', () => {
    const invalidLengthOfTimePeriod = makeFakeTimePeriod({ lengthOfTimePeriod: false });
    expect(() => createTimePeriod(invalidLengthOfTimePeriod)).toThrow('Time Period must be of the format HOURS:MINUTES in number format.');
  });

  it('can create a valid timePeriod entity', () => {
    const noId = makeFakeTimePeriod({ id: undefined, lengthOfTimePeriod: '3:00' });
    const timePeriod = createTimePeriod(noId);
    expect(timePeriod.getId()).toBeDefined();
    expect(timePeriod.getTimePeriodStart()).toBeDefined();
    expect(timePeriod.getTimePeriodEnd()).toBeDefined();
    expect(timePeriod.getTimePeriodStart().from(timePeriod.getTimePeriodEnd())).toEqual('3 hours ago');
  });
});
