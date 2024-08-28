const expect = require('expect');

const { makeGetSwitchboard } = require('../../controllers/get-switchboard');
const { makeFakeSwitchboard } = require('../../../__test__/fixtures/switchboard');

describe('Unit Test: Get switchboard controller', () => {
  it('successfully gets switchboard', async () => {
    const fakeSwitchboard = makeFakeSwitchboard();
    const getSwitchboard = makeGetSwitchboard({ listSwitchboard: () => fakeSwitchboard });

    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      body: fakeSwitchboard,
    };

    const actualSwitchboardResponse = await getSwitchboard(request);
    expect(actualSwitchboardResponse).toEqual(expectedResponse);
  });

  it('reports errors getting switchboard', async () => {
    const getSwitchboard = makeGetSwitchboard({
      listSwitchboard: () => {
        throw Error('Faking something going wrong!');
      },
    });

    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 400,
      body: { error: 'Faking something going wrong!' },
    };

    const actualGetSwitchboardResponse = await getSwitchboard(request);
    expect(actualGetSwitchboardResponse).toEqual(expectedResponse);
  });
});
