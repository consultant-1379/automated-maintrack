const expect = require('expect');

const { makePostSlot } = require('../../controllers/post-slot');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Unit Test: Post slot controller', () => {
  it('successfully posts a slot', async () => {
    const postSlot = makePostSlot({ createNewSlot: dummyFunction => dummyFunction });
    const slot = makeFakeSlot();
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: slot,
    };
    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
        'Last-Modified': new Date(request.body.modifiedOn).toUTCString(),
      },
      statusCode: 201,
      body: { postedSlot: request.body },
    };

    const postedSlotResponse = await postSlot(request);
    expect(postedSlotResponse).toEqual(expectedResponse);
  });

  it('reports user errors', async () => {
    const postSlot = makePostSlot({
      createNewSlot: () => {
        throw Error('Faking something going wrong!');
      },
    });
    const fakeSlot = makeFakeSlot();
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
      statusCode: 400,
      body: { error: 'Faking something going wrong!' },
    };
    const postedSlotResponse = await postSlot(request);
    expect(postedSlotResponse).toEqual(expectedResponse);
  });
});
