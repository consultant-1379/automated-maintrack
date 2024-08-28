const expect = require('expect');

const { makeFakeExcludedTeam } = require('../../../__test__/fixtures/excludedTeams');
const { createExcludedTeam } = require('../../entities');

describe('Unit Test: ExcludedTeam entity', () => {
  it('must have a valid id', () => {
    const excludedTeam = makeFakeExcludedTeam({ id: 'invalid' });
    expect(() => createExcludedTeam(excludedTeam)).toThrow('Excluded team must have a valid id.');
    const noId = makeFakeExcludedTeam({ id: undefined });
    expect(() => createExcludedTeam(noId)).not.toThrow();
  });

  it('can create an id if no id passed in', () => {
    const noId = makeFakeExcludedTeam({ id: undefined });
    const excludedTeam = createExcludedTeam(noId);
    expect(excludedTeam.getId()).toBeDefined();
  });

  it('is createdOn now in UTC', () => {
    const noCreationDate = makeFakeExcludedTeam({ createdOn: undefined });
    expect(noCreationDate.createdOn).not.toBeDefined();
    const date = createExcludedTeam(noCreationDate).getCreatedOn();
    expect(date).toBeDefined();
    expect(date.substring(26)).toBe('GMT');
  });

  it('check teamName value is set properly at excluded team entity creation', () => {
    const excludedTeam = makeFakeExcludedTeam({ teamName: 'team1' });
    const teamName = createExcludedTeam(excludedTeam).getTeamName();
    expect(teamName).toStrictEqual('team1');
  });

  it('must not allow excluded team entity creation if no team name is given', () => {
    const excludedTeam = makeFakeExcludedTeam({ teamName: undefined });
    expect(() => createExcludedTeam(excludedTeam)).toThrow('You must provide a teamName value.');
  });

  it('check signum value is set properly at excluded team entity creation', () => {
    const excludedTeam = makeFakeExcludedTeam({ signum: 'aaaaaa' });
    const signum = createExcludedTeam(excludedTeam).getSignum();
    expect(signum).toStrictEqual('aaaaaa');
  });

  it('must not allow excluded team entity creation if no signum is given', () => {
    const excludedTeam = makeFakeExcludedTeam({ signum: undefined });
    expect(() => createExcludedTeam(excludedTeam)).toThrow('You must provide a signum value.');
  });

  it('check jiraUrls value is set properly at excluded team entity creation', () => {
    const excludedTeam = makeFakeExcludedTeam({ jiraUrls: ['testurl1@jira.com', 'testurl2@jira.com'] });
    const jiraUrls = createExcludedTeam(excludedTeam).getJiraUrls();
    expect(jiraUrls).toStrictEqual(['testurl1@jira.com', 'testurl2@jira.com']);
  });

  it('if no jira urls is given at excluded team entity creation then jira urls is an empty array', () => {
    const excludedTeam = makeFakeExcludedTeam({ jiraUrls: undefined });
    const jiraUrls = createExcludedTeam(excludedTeam).getJiraUrls();
    expect(jiraUrls).toStrictEqual([]);
  });
});
