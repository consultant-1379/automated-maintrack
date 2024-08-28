const expect = require('expect');

const { makeGetSlots } = require('../../controllers/get-slots');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Unit Test: Get slots controller', () => {
  it('successfully gets slots', async () => {
    const fakeSlot = makeFakeSlot();
    const getSlots = makeGetSlots({ listSlots: () => fakeSlot });

    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: fakeSlot,
    };

    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      body: fakeSlot,
    };

    const getSlotsResponse = await getSlots(request);
    expect(getSlotsResponse).toEqual(expectedResponse);
  });
});
