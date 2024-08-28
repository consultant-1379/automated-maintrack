const expect = require('expect');

const { makeUpdateFailureTracker } = require('../../use-cases/update-failure-tracker');
const { makeFakeFailureTracker } = require('../../../__test__/fixtures/failureTracker');
const { makeListFailureTracker } = require('../../use-cases/list-failure-tracker');
const { createFailureTracker } = require('../../entities');

describe('Unit Test: Update failure tracker use case', () => {
  it('must not allow failure tracker update if null deploy phase is given', async () => {
    const expectedFailureTracker = makeFakeFailureTracker({ deployPhase: null });
    const updateFailureTracker = makeUpdateFailureTracker({
      update: () => expectedFailureTracker,
    }, createFailureTracker, makeListFailureTracker({
      findBySearchQuery: () => [expectedFailureTracker],
    }));

    await updateFailureTracker(null, { id: expectedFailureTracker.id }).catch((error) => {
      expect(error.message).toBe('You must specify a deploy phase.');
    });
  });

  it('must not allow failure tracker update if undefined deploy phase is given', async () => {
    const expectedFailureTracker = makeFakeFailureTracker({ deployPhase: undefined });
    const updateFailureTracker = makeUpdateFailureTracker({
      update: () => expectedFailureTracker,
    }, createFailureTracker, makeListFailureTracker({
      findBySearchQuery: () => [expectedFailureTracker],
    }));

    await updateFailureTracker(undefined, { id: expectedFailureTracker.id }).catch((error) => {
      expect(error.message).toBe('You must specify a deploy phase.');
    });
  });

  it('must not allow an invalid deploy phase', async () => {
    const expectedFailureTracker = makeFakeFailureTracker({ deployPhase: 'invalidDeployPhase' });
    const updateFailureTracker = makeUpdateFailureTracker({
      update: () => expectedFailureTracker,
    }, createFailureTracker, makeListFailureTracker({
      findBySearchQuery: () => [expectedFailureTracker],
    }));

    await updateFailureTracker('invalidDeployPhase', { id: expectedFailureTracker.id }).catch((error) => {
      expect(error.message).toBe('You must use either upgrade or install for the deploy phase value.');
    });
  });

  it('must allow upgrade or install as a valid deploy phase', () => {
    const expectedFailureTracker = makeFakeFailureTracker({ deployPhase: 'upgrade' });
    const updateFailureTracker = makeUpdateFailureTracker({
      update: () => expectedFailureTracker,
    }, createFailureTracker, makeListFailureTracker({
      findBySearchQuery: () => [expectedFailureTracker],
    }));
    expect(() => updateFailureTracker('upgrade', { id: expectedFailureTracker.id })).toBeTruthy();
  });

  it('mocks the update of a failure tracker from the database', async () => {
    const failureTracker = makeFakeFailureTracker({ id: '123testId' });
    const expectedFailureTracker = makeFakeFailureTracker();
    const updateFailureTracker = makeUpdateFailureTracker({
      update: () => expectedFailureTracker,
    }, createFailureTracker, makeListFailureTracker({
      findBySearchQuery: () => [failureTracker],
    }));

    const actualFailureTracker = await updateFailureTracker('upgrade', {
      id: expectedFailureTracker.id,
    });
    expect(actualFailureTracker).toEqual(expectedFailureTracker);
  });

  it('mocks the failed update of a failure tracker from the database', async () => {
    const failureTracker = makeFakeFailureTracker({ id: '123testId' });
    const expectedFailureTracker = makeFakeFailureTracker();
    const updateFailureTracker = makeUpdateFailureTracker({
      update: () => null,
    }, createFailureTracker, makeListFailureTracker({
      findBySearchQuery: () => [failureTracker],
    }));

    const actualFailureTracker = await updateFailureTracker('upgrade', {
      id: expectedFailureTracker.id,
    });
    expect(actualFailureTracker).toEqual(failureTracker);
  });
});
