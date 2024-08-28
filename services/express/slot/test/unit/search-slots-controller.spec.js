const expect = require('expect');

const { makeSearchSlots } = require('../../controllers/search-slots');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Unit Test: Search slots controller', () => {
  it('successfully searches for slots', async () => {
    const fakeSlot = makeFakeSlot();
    const searchSlots = makeSearchSlots({ searchForSlots: () => fakeSlot });

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

    const searchSlotsResponse = await searchSlots(request);
    expect(searchSlotsResponse).toEqual(expectedResponse);
  });
});
