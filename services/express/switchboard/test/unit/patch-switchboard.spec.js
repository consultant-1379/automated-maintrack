const expect = require('expect');

const { makePatchSwitchboard } = require('../../controllers/patch-switchboard');
const { makeFakeSwitchboard } = require('../../../__test__/fixtures/switchboard');

describe('Unit Test: Patch switchboard controller', () => {
  it('successfully patches a switchboard', async () => {
    const fakeSwitchboard = makeFakeSwitchboard();
    const patchSwitchboard = makePatchSwitchboard({ modifySwitchboard: dummyFunction => dummyFunction });
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        id: fakeSwitchboard.id,
      },
      body: fakeSwitchboard,
    };

    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
        'Last-Modified': new Date(request.body.modifiedOn).toUTCString(),
      },
      statusCode: 200,
      body: { patchedSwitchboard: request.body },
    };

    const patchedSwitchboardResponse = await patchSwitchboard(request);
    expect(patchedSwitchboardResponse).toEqual(expectedResponse);
  });

  it('reports user errors', async () => {
    const fakeSwitchboard = makeFakeSwitchboard();
    const patchSwitchboard = makePatchSwitchboard({
      modifySwitchboard: () => {
        throw Error('Faking something going wrong!');
      },
    });

    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        id: fakeSwitchboard.id,
      },
      body: fakeSwitchboard,
    };

    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 400,
      body: { error: 'Faking something going wrong!' },
    };

    const actualPatchedSwitchboardResponse = await patchSwitchboard(request);
    expect(actualPatchedSwitchboardResponse).toEqual(expectedResponse);
  });
});
