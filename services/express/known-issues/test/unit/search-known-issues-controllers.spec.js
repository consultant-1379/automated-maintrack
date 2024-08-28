const expect = require('expect');

const { makeSearchKnownIssues } = require('../../controllers/search-known-issues');
const { makeFakeKnownIssue } = require('../../../__test__/fixtures/knownIssues');

describe('Unit Test: Search known issues controller', () => {
  it('successfully searches for known issues', async () => {
    const fakeKnownIssue = makeFakeKnownIssue();
    const searchKnownIssues = makeSearchKnownIssues({ searchForKnownIssues: () => fakeKnownIssue });

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

    const searchKnownIssuesResponse = await searchKnownIssues(request);
    expect(searchKnownIssuesResponse).toEqual(expectedResponse);
  });

  it('reports user errors', async () => {
    const searchKnownIssues = makeSearchKnownIssues({
      searchForKnownIssues: () => {
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

    const searchKnownIssuesResponse = await searchKnownIssues(request);
    expect(searchKnownIssuesResponse).toEqual(expectedResponse);
  });
});
