const expect = require('expect');

const { makeCreateKnownIssue } = require('./../../use-cases/create-known-issue');
const { makeFakeKnownIssue } = require('../../../__test__/fixtures/knownIssues');
const { createKnownIssue } = require('../../entities');

describe('Unit Test: Create known issue use case', () => {
  it('mocks the insertion of a known issue in the database', async () => {
    const newKnownIssue = makeFakeKnownIssue();
    const createKnownIssues = makeCreateKnownIssue({
      insert: () => newKnownIssue,
    }, createKnownIssue);

    const inserted = await createKnownIssues(newKnownIssue);
    expect(inserted).toMatchObject(newKnownIssue);
  });
});
