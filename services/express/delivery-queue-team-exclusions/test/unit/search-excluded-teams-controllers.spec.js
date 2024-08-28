const expect = require('expect');

const { makeSearchExcludedTeams } = require('../../controllers/search-excluded-teams');
const { makeFakeExcludedTeam } = require('../../../__test__/fixtures/excludedTeams');

describe('Unit Test: Search excluded teams controller', () => {
  it('successfully searches for excluded teams', async () => {
    const fakeExcludedTeam = makeFakeExcludedTeam();
    const searchExcludedTeams = makeSearchExcludedTeams({ searchForExcludedTeams: () => fakeExcludedTeam });

    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: fakeExcludedTeam,
    };

    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      body: fakeExcludedTeam,
    };

    const searchExcludedTeamsResponse = await searchExcludedTeams(request);
    expect(searchExcludedTeamsResponse).toEqual(expectedResponse);
  });

  it('reports user errors', async () => {
    const searchExcludedTeams = makeSearchExcludedTeams({
      searchForExcludedTeams: () => {
        throw Error('Faking something going wrong!');
      },
    });
    const fakeExcludedTeam = makeFakeExcludedTeam();
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: fakeExcludedTeam,
    };
    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 400,
      body: { error: 'Faking something going wrong!' },
    };

    const searchExcludedTeamsResponse = await searchExcludedTeams(request);
    expect(searchExcludedTeamsResponse).toEqual(expectedResponse);
  });
});
