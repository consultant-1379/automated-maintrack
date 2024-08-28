const expect = require('expect');

const { makeCreateExcludedTeam } = require('../../use-cases/create-excluded-team');
const { makeFakeExcludedTeam } = require('../../../__test__/fixtures/excludedTeams');
const { createExcludedTeam } = require('../../entities');

describe('Unit Test: Create Excluded Team use case', () => {
  it('mocks the insertion of a excluded team in the database', async () => {
    const newExcludedTeam = makeFakeExcludedTeam();
    const createExcludedTeams = makeCreateExcludedTeam({
      insert: () => newExcludedTeam,
    }, createExcludedTeam);

    const inserted = await createExcludedTeams(newExcludedTeam);
    expect(inserted).toMatchObject(newExcludedTeam);
  });
});
