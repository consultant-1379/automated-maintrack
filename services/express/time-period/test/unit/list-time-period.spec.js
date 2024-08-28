const expect = require('expect');

const { makeListTimePeriod } = require('./../../use-cases/list-time-period');
const { makeFakeTimePeriod } = require('../../../__test__/fixtures/timePeriod');

describe('Unit Test: List time period use case', () => {
  it('mocks the listing of time period from the database', async () => {
    const newTimePeriod = makeFakeTimePeriod();
    const listTimePeriod = makeListTimePeriod({
      findAll: () => [newTimePeriod],
    });

    const retrieved = await listTimePeriod({});
    expect(retrieved).toEqual([newTimePeriod]);
  });
});
