const expect = require('expect');

const { makeRetrieveListOfKnownIssuesNames } = require('./../../use-cases/retrieve-list-of-known-issues-names');
const { makeFakeKnownIssue } = require('../../../__test__/fixtures/knownIssues');

describe('Unit Test: Retrieve list of known issues names use case', () => {
  it('mocks the retrieving of the list of known issues names from the database when some known issues exist', async () => {
    const newKnownIssue1 = makeFakeKnownIssue();
    const newKnownIssue2 = makeFakeKnownIssue();
    const retrieveListOfKnownIssuesNames = makeRetrieveListOfKnownIssuesNames({
      findAll: () => [newKnownIssue1, newKnownIssue2],
    });

    const retrieved = await retrieveListOfKnownIssuesNames();
    expect(retrieved).toEqual([newKnownIssue1.testSuiteName, newKnownIssue2.testSuiteName]);
  });

  it('mocks the retrieving of the list of known issues names from the database when there are no known issues', async () => {
    const retrieveListOfKnownIssuesNames = makeRetrieveListOfKnownIssuesNames({
      findAll: () => [],
    });

    const retrieved = await retrieveListOfKnownIssuesNames();
    expect(retrieved).toEqual([]);
  });
});
