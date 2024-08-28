function makeCreateKnownIssue(knownIssueDb, createKnownIssue) {
  return async function addKnownIssue(knownIssueInfo) {
    const knownIssue = createKnownIssue(knownIssueInfo);
    return knownIssueDb.insert({
      id: knownIssue.getId(),
      testSuiteName: knownIssue.getTestSuiteName(),
      jiraUrls: knownIssue.getJiraUrls(),
      signum: knownIssue.getSignum(),
      createdOn: knownIssue.getCreatedOn(),
      modifiedOn: knownIssue.getModifiedOn(),
    }, 'knownIssues');
  };
}

module.exports = { makeCreateKnownIssue };
