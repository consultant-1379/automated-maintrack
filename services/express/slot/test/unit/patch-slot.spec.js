const expect = require('expect');

const { makePatchSlot } = require('../../controllers/patch-slot');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Unit Test: Patch slot controller', () => {
  it('successfully patches a slot', async () => {
    const fakeSlot = makeFakeSlot();
    const patchSlot = makePatchSlot({ modifySlot: dummyFunction => dummyFunction });
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
        'Last-Modified': new Date(request.body.modifiedOn).toUTCString(),
      },
      statusCode: 200,
      body: { patchedSlot: request.body },
    };

    const patchedSlotResponse = await patchSlot(request);
    expect(patchedSlotResponse).toEqual(expectedResponse);
  });

  it('reports user errors', async () => {
    const fakeSlot = makeFakeSlot();
    const patchSlot = makePatchSlot({
      modifySlot: () => {
        throw Error('Faking something going wrong!');
      },
    });

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
      statusCode: 400,
      body: { error: 'Faking something going wrong!' },
    };

    const patchedSlotResponse = await patchSlot(request);
    expect(patchedSlotResponse).toEqual(expectedResponse);
  });
});
