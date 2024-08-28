const expect = require('expect');

const { makeGetKnownIssues } = require('../../controllers/get-known-issues');
const { makeFakeKnownIssue } = require('../../../__test__/fixtures/knownIssues');

describe('Unit Test: Get known issues controller', () => {
  it('successfully gets known issues', async () => {
    const fakeKnownIssue = makeFakeKnownIssue();
    const getKnownIssues = makeGetKnownIssues({ listKnownIssues: () => fakeKnownIssue });

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
      statusCode: 200,
      body: fakeKnownIssue,
    };

    const getKnownIssuesResponse = await getKnownIssues(request);
    expect(getKnownIssuesResponse).toEqual(expectedResponse);
  });

  it('reports user errors', async () => {
    const getKnownIssues = makeGetKnownIssues({
      listKnownIssues: () => {
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

    const getKnownIssuesResponse = await getKnownIssues(request);
    expect(getKnownIssuesResponse).toEqual(expectedResponse);
  });
});
