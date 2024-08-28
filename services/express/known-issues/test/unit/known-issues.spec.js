const expect = require('expect');

const { makeFakeKnownIssue } = require('../../../__test__/fixtures/knownIssues');
const { createKnownIssue } = require('../../entities');

describe('Unit Test: KnownIssue entity', () => {
  it('must have a valid id', () => {
    const knownIssue = makeFakeKnownIssue({ id: 'invalid' });
    expect(() => createKnownIssue(knownIssue)).toThrow('Known issue must have a valid id.');
    const noId = makeFakeKnownIssue({ id: undefined });
    expect(() => createKnownIssue(noId)).not.toThrow();
  });

  it('can create an id if no id passed in', () => {
    const noId = makeFakeKnownIssue({ id: undefined });
    const knownIssue = createKnownIssue(noId);
    expect(knownIssue.getId()).toBeDefined();
  });

  it('is createdOn now in UTC', () => {
    const noCreationDate = makeFakeKnownIssue({ createdOn: undefined });
    expect(noCreationDate.createdOn).not.toBeDefined();
    const date = createKnownIssue(noCreationDate).getCreatedOn();
    expect(date).toBeDefined();
    expect(date.substring(26)).toBe('GMT');
  });

  it('check testSuiteName value is set properly at known issue entity creation', () => {
    const knownIssue = makeFakeKnownIssue({ testSuiteName: 'testcase1' });
    const testSuiteName = createKnownIssue(knownIssue).getTestSuiteName();
    expect(testSuiteName).toStrictEqual('testcase1');
  });

  it('must not allow known issue entity creation if no test suite name is given', () => {
    const knownIssue = makeFakeKnownIssue({ testSuiteName: undefined });
    expect(() => createKnownIssue(knownIssue)).toThrow('You must provide a testSuiteName value.');
  });

  it('check signum value is set properly at known issue entity creation', () => {
    const knownIssue = makeFakeKnownIssue({ signum: 'aaaaaa' });
    const signum = createKnownIssue(knownIssue).getSignum();
    expect(signum).toStrictEqual('aaaaaa');
  });

  it('must not allow known issue entity creation if no signum is given', () => {
    const knownIssue = makeFakeKnownIssue({ signum: undefined });
    expect(() => createKnownIssue(knownIssue)).toThrow('You must provide a signum value.');
  });

  it('check jiraUrls value is set properly at known issue entity creation', () => {
    const knownIssue = makeFakeKnownIssue({ jiraUrls: ['testurl1@jira.com', 'testurl2@jira.com'] });
    const jiraUrls = createKnownIssue(knownIssue).getJiraUrls();
    expect(jiraUrls).toStrictEqual(['testurl1@jira.com', 'testurl2@jira.com']);
  });

  it('if no jira urls is given at known issue entity creation then jira urls is an empty array', () => {
    const knownIssue = makeFakeKnownIssue({ jiraUrls: undefined });
    const jiraUrls = createKnownIssue(knownIssue).getJiraUrls();
    expect(jiraUrls).toStrictEqual([]);
  });
});
