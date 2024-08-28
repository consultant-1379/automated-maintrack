const expect = require('expect');

const { makePostTimePeriod } = require('../../controllers/post-time-period');
const { makeFakeTimePeriod } = require('../../../__test__/fixtures/timePeriod');

describe('Unit Test: Post time period controller', () => {
  it('successfully posts a time period', async () => {
    const postTimePeriod = makePostTimePeriod({ createNewTimePeriod: dummyFunction => dummyFunction });
    const timePeriod = makeFakeTimePeriod();
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: timePeriod,
    };
    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 201,
      body: { postedTimePeriod: request.body },
    };

    const postedTimePeriodResponse = await postTimePeriod(request);
    expect(postedTimePeriodResponse).toEqual(expectedResponse);
  });

  it('reports user errors', async () => {
    const postTimePeriod = makePostTimePeriod({
      createNewTimePeriod: () => {
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
    const postedTimePeriodResponse = await postTimePeriod(request);
    expect(postedTimePeriodResponse).toEqual(expectedResponse);
  });
});
