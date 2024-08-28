const expect = require('expect');

const { makeRemoveKnownIssue } = require('./../../use-cases/remove-known-issue');
const { makeFakeKnownIssue } = require('../../../__test__/fixtures/knownIssues');

describe('Unit Test: Remove known issue use case', () => {
  it('mocks the removing of a known issue from the database', async () => {
    const newKnownIssue = makeFakeKnownIssue();
    const removeKnownIssue = makeRemoveKnownIssue({
      remove: () => 1,
    });

    const deletedCount = await removeKnownIssue({
      id: newKnownIssue.id,
    });

    expect(deletedCount).toBe(1);
  });
});
