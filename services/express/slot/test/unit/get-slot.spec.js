const expect = require('expect');

const { makeGetSlot } = require('../../controllers/get-slot');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Unit Test: Get slot controller', () => {
  it('successfully gets a slot', async () => {
    const fakeSlot = makeFakeSlot();
    const getSlot = makeGetSlot({ listSlot: dummyFunction => dummyFunction });

    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        id: fakeSlot.id,
      },
      body: fakeSlot,
    };

    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      body: { id: fakeSlot.id },
    };

    const getSlotResponse = await getSlot(request);
    expect(getSlotResponse).toEqual(expectedResponse);
  });
});
