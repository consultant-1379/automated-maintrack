const expect = require('expect');

const { makePostExcludedTeam } = require('../../controllers/post-excluded-team');
const { makeFakeExcludedTeam } = require('../../../__test__/fixtures/excludedTeams');

describe('Unit Test: Post excluded team controller', () => {
  it('successfully posts a excluded team', async () => {
    const postExcludedTeam = makePostExcludedTeam({ createNewExcludedTeam: dummyFunction => dummyFunction });
    const excludedTeam = makeFakeExcludedTeam();
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: excludedTeam,
    };
    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
        'Last-Modified': request.body.modifiedOn,
      },
      statusCode: 201,
      body: { postedExcludedTeam: request.body },
    };

    const postedExcludedTeamResponse = await postExcludedTeam(request);
    expect(postedExcludedTeamResponse).toEqual(expectedResponse);
  });

  it('reports user errors', async () => {
    const postExcludedTeam = makePostExcludedTeam({
      createNewExcludedTeam: () => {
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
    const postedExcludedTeamResponse = await postExcludedTeam(request);
    expect(postedExcludedTeamResponse).toEqual(expectedResponse);
  });
});
