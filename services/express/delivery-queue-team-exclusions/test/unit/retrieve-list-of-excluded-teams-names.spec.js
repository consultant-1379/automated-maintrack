const expect = require('expect');

const { makeRetrieveListOfExcludedTeamsNames } = require('../../use-cases/retrieve-list-of-excluded-teams-names');
const { makeFakeExcludedTeam } = require('../../../__test__/fixtures/excludedTeams');

describe('Unit Test: Retrieve list of excluded teams names use case', () => {
  it('mocks the retrieving of the list of excluded team names from the database when some excluded teams exist', async () => {
    const newExcludedTeam1 = makeFakeExcludedTeam();
    const newExcludedTeam2 = makeFakeExcludedTeam();
    const retrieveListOfExcludedTeamsNames = makeRetrieveListOfExcludedTeamsNames({
      findAll: () => [newExcludedTeam1, newExcludedTeam2],
    });

    const retrieved = await retrieveListOfExcludedTeamsNames();
    expect(retrieved).toEqual([newExcludedTeam1.teamName, newExcludedTeam2.teamName]);
  });

  it('mocks the retrieving of the list of excluded teams names from the database when there are no excluded teams', async () => {
    const retrieveListOfExcludedTeamsNames = makeRetrieveListOfExcludedTeamsNames({
      findAll: () => [],
    });

    const retrieved = await retrieveListOfExcludedTeamsNames();
    expect(retrieved).toEqual([]);
  });
});
