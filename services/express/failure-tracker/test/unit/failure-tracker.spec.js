const expect = require('expect');

const { makeFakeFailureTracker } = require('../../../__test__/fixtures/failureTracker');
const { createFailureTracker } = require('../../entities');

describe('Unit Test: Failure tracker entity', () => {
  it('must have a valid id', () => {
    const failureTracker = makeFakeFailureTracker({ id: 'invalid' });
    expect(() => createFailureTracker(failureTracker)).toThrow('Failure tracker must have a valid id.');
    const noId = makeFakeFailureTracker({ id: undefined });
    expect(() => createFailureTracker(noId)).not.toThrow();
  });

  it('can create an id if no id passed in', () => {
    const noId = makeFakeFailureTracker({ id: undefined });
    const failureTracker = createFailureTracker(noId);
    expect(failureTracker.getId()).toBeDefined();
  });

  it('must not allow failure tracker creation if null deploy phase is given', () => {
    const failureTracker = makeFakeFailureTracker({ deployPhase: null });
    expect(() => createFailureTracker(failureTracker)).toThrow('You must specify a deploy phase.');
  });

  it('must not allow failure tracker creation if undefined deploy phase is given', () => {
    const failureTracker = makeFakeFailureTracker({ deployPhase: undefined });
    expect(() => createFailureTracker(failureTracker)).toThrow('You must specify a deploy phase.');
  });

  it('must allow a upgrade or install as a valid deploy phase', () => {
    const failureTrackerWithValidDeployPhase = makeFakeFailureTracker({ deployPhase: 'upgrade' });
    expect(() => createFailureTracker(failureTrackerWithValidDeployPhase)).toBeTruthy();
  });

  it('must not allow an invalid deploy phase', () => {
    const failureTracker = makeFakeFailureTracker({ deployPhase: 'invalidDeployPhase' });
    expect(() => createFailureTracker(failureTracker).toThrow('You must use either upgrade or install for the deploy phase value.'));
  });

  it('can set the failure count to 0 if no value is passed in', () => {
    const noFailureCount = makeFakeFailureTracker({ failureCount: undefined });
    const failureTracker = createFailureTracker(noFailureCount);
    expect(failureTracker.getFailureCount()).toBe(0);
  });

  it('is createdOn now in UTC', () => {
    const noCreationDate = makeFakeFailureTracker({ createdOn: undefined });
    expect(noCreationDate.createdOn).not.toBeDefined();
    const creationDate = createFailureTracker(noCreationDate).getCreatedOn();
    expect(creationDate).toBeDefined();
    expect(new Date(creationDate).toUTCString().substring(26)).toBe('GMT');
  });
});
