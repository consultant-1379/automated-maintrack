const expect = require('expect');

const { makeCreateTimePeriod } = require('./../../use-cases/create-time-period');
const { makeFakeTimePeriod } = require('../../../__test__/fixtures/timePeriod');
const { createTimePeriod } = require('../../entities');

describe('Unit Test: Create time period use case', () => {
  it('mocks the insertion of a time period in the database', async () => {
    const newTimePeriod = makeFakeTimePeriod();
    const createTimePeriodFunction = makeCreateTimePeriod({
      insert: () => newTimePeriod,
    }, createTimePeriod);

    const inserted = await createTimePeriodFunction(newTimePeriod);
    expect(inserted).toMatchObject(newTimePeriod);
  });
});
