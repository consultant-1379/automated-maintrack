const expect = require('expect');

const { makeListSwitchboard } = require('../../use-cases/list-switchboard');
const { makeFakeSwitchboard } = require('../../../__test__/fixtures/switchboard');

describe('Unit Test: List switchboard use case', () => {
  it('mocks the listing of a switchboard from the database', async () => {
    const newSwitchboard = makeFakeSwitchboard();
    const listSwitchboard = makeListSwitchboard({
      findAll: () => [newSwitchboard],
    });

    const retrievedSwitchboard = await listSwitchboard({});
    expect(retrievedSwitchboard).toEqual([newSwitchboard]);
  });
});
