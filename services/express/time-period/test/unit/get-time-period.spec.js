const expect = require('expect');

const { makeGetTimePeriod } = require('../../controllers/get-time-period');
const { makeFakeTimePeriod } = require('../../../__test__/fixtures/timePeriod');

describe('Unit Test: Get time period controller', () => {
  it('successfully gets time period', async () => {
    const fakeTimePeriod = makeFakeTimePeriod();
    const getTimePeriod = makeGetTimePeriod({ listTimePeriod: () => fakeTimePeriod });

    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: fakeTimePeriod,
    };

    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      body: fakeTimePeriod,
    };

    const getTimePeriodsResponse = await getTimePeriod(request);
    expect(getTimePeriodsResponse).toEqual(expectedResponse);
  });

  it('reports user errors', async () => {
    const getTimePeriod = makeGetTimePeriod({
      listTimePeriod: () => {
        throw Error('Faking something going wrong!');
      },
    });
    const fakeTimePeriod = makeFakeTimePeriod();
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: fakeTimePeriod,
    };
    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 400,
      body: { error: 'Faking something going wrong!' },
    };

    const getTimePeriodsResponse = await getTimePeriod(request);
    expect(getTimePeriodsResponse).toEqual(expectedResponse);
  });
});
