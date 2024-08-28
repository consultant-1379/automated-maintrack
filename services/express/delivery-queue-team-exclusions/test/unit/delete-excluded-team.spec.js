const expect = require('expect');

const { makeDeleteExcludedTeam } = require('../../controllers/delete-excluded-team');
const { makeFakeExcludedTeam } = require('../../../__test__/fixtures/excludedTeams');

describe('Unit Test: Delete excluded team controller', () => {
  it('successfully deletes an excluded team', async () => {
    const fakeExcludedTeam = makeFakeExcludedTeam();
    const deleteExcludedTeam = makeDeleteExcludedTeam({ removeExcludedTeam: dummyFunction => dummyFunction });

    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        id: fakeExcludedTeam.id,
      },
    };

    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      body: 'Deleted Excluded team',
    };

    const deleteExcludedTeamResponse = await deleteExcludedTeam(request);
    expect(deleteExcludedTeamResponse).toEqual(expectedResponse);
  });

  it('reports user errors', async () => {
    const deleteExcludedTeam = makeDeleteExcludedTeam({
      removeExcludedTeam: () => {
        throw Error('Faking something going wrong!');
      },
    });
    const fakeExcludedTeam = makeFakeExcludedTeam();
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        id: fakeExcludedTeam.id,
      },
    };
    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 400,
      body: { error: 'Faking something going wrong!' },
    };

    const deleteExcludedTeamResponse = await deleteExcludedTeam(request);
    expect(deleteExcludedTeamResponse).toEqual(expectedResponse);
  });
});
