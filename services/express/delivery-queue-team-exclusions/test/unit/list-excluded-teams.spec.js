const expect = require('expect');

const { makeListExcludedTeams } = require('./../../use-cases/list-excluded-teams');
const { makeFakeExcludedTeam } = require('../../../__test__/fixtures/excludedTeams');

describe('Unit Test: List excluded teams use case', () => {
  it('mocks the listing of excluded teams from the database', async () => {
    const newExcludedTeam1 = makeFakeExcludedTeam();
    const newExcludedTeam2 = makeFakeExcludedTeam();
    const listExcludedTeams = makeListExcludedTeams({
      findAll: () => [newExcludedTeam1, newExcludedTeam2],
    });

    const retrieved = await listExcludedTeams();
    expect(retrieved).toEqual([newExcludedTeam1, newExcludedTeam2]);
  });
});
