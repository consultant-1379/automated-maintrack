const expect = require('expect');

const { makeListFailureTracker } = require('../../use-cases/list-failure-tracker');
const { makeFakeFailureTracker } = require('../../../__test__/fixtures/failureTracker');

describe('Unit Test: List failure tracker use case', () => {
  const failureTracker = makeFakeFailureTracker();
  it('must not allow failure tracker creation if null deploy phase is given', (done) => {
    const listFailureTracker = makeListFailureTracker({
      findBySearchQuery: () => [failureTracker],
    });
    listFailureTracker(null).catch((error) => {
      expect(error.message).toBe('You must specify a deploy phase.');
    })
      .then(done, done);
  });

  it('must not allow failure tracker creation if undefined deploy phase is given', (done) => {
    const listFailureTracker = makeListFailureTracker({
      findBySearchQuery: () => [failureTracker],
    });
    listFailureTracker(undefined).catch((error) => {
      expect(error.message).toBe('You must specify a deploy phase.');
    })
      .then(done, done);
  });

  it('must not allow an invalid deploy phase', (done) => {
    const listFailureTracker = makeListFailureTracker({
      findBySearchQuery: () => [failureTracker],
    });
    listFailureTracker('invalidDeployPhase').catch((error) => {
      expect(error.message).toBe('You must use either upgrade or install for the deploy phase value.');
    })
      .then(done, done);
  });

  it('mocks the retrieval of the failure tracker list from the database', async () => {
    const listFailureTracker = makeListFailureTracker({
      findBySearchQuery: () => [failureTracker],
    });
    const retrievedFailureTracker = await listFailureTracker('upgrade');
    expect(retrievedFailureTracker).toEqual(failureTracker);
  });

  it('should return null if there is no failureTracker in the database', async () => {
    const listFailureTracker = makeListFailureTracker({ findBySearchQuery: () => [] });
    const returnedFailureTracker = await listFailureTracker('upgrade');
    expect(returnedFailureTracker).toBe(null);
  });

  it('should throw an error is there is 2 or more failureTrackers of the same deploy phase in the database', (done) => {
    const listFailureTracker = makeListFailureTracker({ findBySearchQuery: () => [failureTracker, failureTracker] });
    listFailureTracker('upgrade').catch((error) => {
      expect(error.message).toBe('More then one failure tracker with deploy phase upgrade was found.');
    })
      .then(done, done);
  });
});
