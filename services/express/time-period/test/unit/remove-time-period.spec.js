const expect = require('expect');

const { makeRemoveTimePeriod } = require('./../../use-cases/remove-time-period');
const { makeFakeTimePeriod } = require('../../../__test__/fixtures/timePeriod');

describe('Unit Test: Remove time period use case', () => {
  it('mocks the removing of a time period from the database', async () => {
    const newTimePeriod = makeFakeTimePeriod();
    const removeTimePeriod = makeRemoveTimePeriod({
      remove: () => 1,
    });

    const deletedCount = await removeTimePeriod({
      id: newTimePeriod.id,
    });

    expect(deletedCount).toBe(1);
  });
});
