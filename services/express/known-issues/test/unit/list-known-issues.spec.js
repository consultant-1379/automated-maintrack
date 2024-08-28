const expect = require('expect');

const { makeListKnownIssues } = require('./../../use-cases/list-known-issues');
const { makeFakeKnownIssue } = require('../../../__test__/fixtures/knownIssues');

describe('Unit Test: List known issues use case', () => {
  it('mocks the listing of known issues from the database', async () => {
    const newKnownIssue1 = makeFakeKnownIssue();
    const newKnownIssue2 = makeFakeKnownIssue();
    const listKnownIssue = makeListKnownIssues({
      findAll: () => [newKnownIssue1, newKnownIssue2],
    });

    const retrieved = await listKnownIssue();
    expect(retrieved).toEqual([newKnownIssue1, newKnownIssue2]);
  });
});
