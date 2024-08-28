const expect = require('expect');

const { makeDeleteKnownIssue } = require('../../controllers/delete-known-issue');
const { makeFakeKnownIssue } = require('../../../__test__/fixtures/knownIssues');

describe('Unit Test: Delete known issue controller', () => {
  it('successfully deletes a known issue', async () => {
    const fakeKnownIssue = makeFakeKnownIssue();
    const deleteKnownIssue = makeDeleteKnownIssue({ removeKnownIssue: dummyFunction => dummyFunction });

    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        id: fakeKnownIssue.id,
      },
    };

    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      body: 'Deleted known issue',
    };

    const deleteKnownIssueResponse = await deleteKnownIssue(request);
    expect(deleteKnownIssueResponse).toEqual(expectedResponse);
  });

  it('reports user errors', async () => {
    const deleteKnownIssue = makeDeleteKnownIssue({
      removeKnownIssue: () => {
        throw Error('Faking something going wrong!');
      },
    });
    const fakeKnownIssue = makeFakeKnownIssue();
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        id: fakeKnownIssue.id,
      },
    };
    const expectedResponse = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 400,
      body: { error: 'Faking something going wrong!' },
    };

    const deleteKnownIssueResponse = await deleteKnownIssue(request);
    expect(deleteKnownIssueResponse).toEqual(expectedResponse);
  });
});
