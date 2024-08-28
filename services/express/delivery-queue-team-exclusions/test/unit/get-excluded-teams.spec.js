const expect = require('expect');

const { makeGetExcludedTeams } = require('../../controllers/get-excluded-teams');
const { makeFakeExcludedTeam } = require('../../../__test__/fixtures/excludedTeams');

describe('Unit Test: Get excluded teams controller', () => {
  it('successfully gets excluded teams', async () => {
    const fakeExcludedTeam = makeFakeExcludedTeam();
    const getExcludedTeams = makeGetExcludedTeams({ listExcludedTeams: () => fakeExcludedTeam });

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

    const getExcludedTeamsResponse = await getExcludedTeams(request);
    expect(getExcludedTeamsResponse).toEqual(expectedResponse);
  });

  it('reports user errors', async () => {
    const getExcludedTeams = makeGetExcludedTeams({
      listExcludedTeams: () => {
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

    const getExcludedTeamsResponse = await getExcludedTeams(request);
    expect(getExcludedTeamsResponse).toEqual(expectedResponse);
  });
});
