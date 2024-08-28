const expect = require('expect');

const { makeCreateFailureTracker } = require('../../use-cases/create-failure-tracker');
const { makeFakeFailureTracker } = require('../../../__test__/fixtures/failureTracker');
const { createFailureTracker } = require('../../entities');

describe('Unit Test: Create failure tracker use case', () => {
  it('mocks the insertion of a failureTracker in the database', async () => {
    const failureTracker = makeFakeFailureTracker();
    const createFailureTrackers = makeCreateFailureTracker({
      insert: () => failureTracker,
    }, createFailureTracker);

    const insertedFailureTracker = await createFailureTrackers(failureTracker);
    expect(insertedFailureTracker).toMatchObject(failureTracker);
  });
});
