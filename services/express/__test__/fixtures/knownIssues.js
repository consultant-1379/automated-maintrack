const faker = require('faker');
const cuid = require('cuid');

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

function makeFakeKnownIssue(overrides) {
  const validTestSuiteNameOptions = [
    'testSuite1',
    'testSuite2',
  ];
  const validJiraUrlsOptions = [
    'https://jira-oss.seli.wh.rnd.internal.ericsson.com/browse/RTD-16504',
    'https://jira-oss.seli.wh.rnd.internal.ericsson.com/browse/RTD-16455',
  ];
  const validSignumOptions = [
    'eaaaaaa',
    'ebbbbbb',
  ];

  const randomTestSuiteName = faker.random.arrayElement(validTestSuiteNameOptions);
  const randomJiraUrls = faker.random.arrayElement(validJiraUrlsOptions);
  const randomSignum = faker.random.arrayElement(validSignumOptions);

  const knownIssue = {
    id: Id.makeId(),
    testSuiteName: randomTestSuiteName,
    jiraUrls: randomJiraUrls,
    signum: randomSignum,
    createdOn: new Date(Date.now()).toUTCString(),
  };

  return {
    ...knownIssue,
    ...overrides,
  };
}

module.exports = { makeFakeKnownIssue };
