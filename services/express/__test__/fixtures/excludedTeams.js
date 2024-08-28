const faker = require('faker');
const cuid = require('cuid');

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

function makeFakeExcludedTeam(overrides) {
  const validTeamNameOptions = [
    'team1',
    'team2',
  ];
  const validJiraUrlsOptions = [
    'https://jira-oss.seli.wh.rnd.internal.ericsson.com/browse/RTD-16504',
    'https://jira-oss.seli.wh.rnd.internal.ericsson.com/browse/RTD-16455',
  ];
  const validSignumOptions = [
    'eaaaaaa',
    'ebbbbbb',
  ];

  const randomTeamName = faker.random.arrayElement(validTeamNameOptions);
  const randomJiraUrls = faker.random.arrayElement(validJiraUrlsOptions);
  const randomSignum = faker.random.arrayElement(validSignumOptions);

  const excludedTeam = {
    id: Id.makeId(),
    teamName: randomTeamName,
    jiraUrls: randomJiraUrls,
    signum: randomSignum,
    createdOn: new Date(Date.now()).toUTCString(),
  };

  return {
    ...excludedTeam,
    ...overrides,
  };
}

module.exports = { makeFakeExcludedTeam };
