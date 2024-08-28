const expect = require('expect');

const { makePostKnownIssue } = require('../../controllers/post-known-issue');
const { makeFakeKnownIssue } = require('../../../__test__/fixtures/knownIssues');

describe('Unit Test: Post known issue controller', () => {
  it('successfully posts a known issue', async () => {
    const postKnownIssue = makePostKnownIssue({ createNewKnownIssue: dummyFunction => dummyFunction });
    const knownIssue = makeFakeKnownIssue();
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: knownIssue,
    };
    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
        'Last-Modified': request.body.modifiedOn,
      },
      statusCode: 201,
      body: { postedKnownIssue: request.body },
    };

    const postedKnownIssueResponse = await postKnownIssue(request);
    expect(postedKnownIssueResponse).toEqual(expectedResponse);
  });

  it('reports user errors', async () => {
    const postKnownIssue = makePostKnownIssue({
      createNewKnownIssue: () => {
        throw Error('Faking something going wrong!');
      },
    });
    const fakeKnownIssue = makeFakeKnownIssue();
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: fakeKnownIssue,
    };
    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 400,
      body: { error: 'Faking something going wrong!' },
    };
    const postedKnownIssueResponse = await postKnownIssue(request);
    expect(postedKnownIssueResponse).toEqual(expectedResponse);
  });
});
