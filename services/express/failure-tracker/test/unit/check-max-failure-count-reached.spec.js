const expect = require('expect');

const { makeCheckMaxFailureCountReached } = require('../../use-cases/check-max-failure-count-reached');
const { makeFakeFailureTracker } = require('../../../__test__/fixtures/failureTracker');

describe('Unit Test: Check max failure count reached use case', () => {
  let failureTracker = makeFakeFailureTracker();
  const checkMaxFailureCountReached = makeCheckMaxFailureCountReached();
  it('should throw an error if the maxFailureCount is a string value', () => {
    expect(() => checkMaxFailureCountReached(failureTracker, 'five')).toThrow('Max failure count number must be a positive number and also must be an integer.');
  });

  it('should throw an error if the maxFailureCount is a negative number', () => {
    expect(() => checkMaxFailureCountReached(failureTracker, -88)).toThrow('Max failure count number must be a positive number and also must be an integer.');
  });

  it('should throw an error if the maxFailureCount is not an integer', () => {
    expect(() => checkMaxFailureCountReached(failureTracker, 8.88)).toThrow('Max failure count number must be a positive number and also must be an integer.');
  });

  it('should throw an error if the maxFailureCount is null', () => {
    expect(() => checkMaxFailureCountReached(failureTracker, null)).toThrow('You must specify a max failure count.');
  });

  it('should throw an error if the maxFailureCount is undefined', () => {
    expect(() => checkMaxFailureCountReached(failureTracker, undefined)).toThrow('You must specify a max failure count.');
  });

  it('tests that the failure count is not equal to the max failure count', () => {
    expect(checkMaxFailureCountReached(failureTracker, 5)).toBe(false);
  });

  it('tests that the failure count is equal to the max failure count', () => {
    failureTracker = makeFakeFailureTracker({ failureCount: 5 });
    expect(checkMaxFailureCountReached(failureTracker, 5)).toBe(true);
  });
});
