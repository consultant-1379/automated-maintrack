function makeRetrieveListOfKnownIssuesNames(knownIssueDb) {
  return async function retrieveListOfKnownIssuesNames() {
    const knownIssues = await knownIssueDb.findAll('knownIssues');
    const listOfKnownIssuesNames = [];
    if (knownIssues.length > 0) {
      for (const knownIssue of knownIssues) {
        listOfKnownIssuesNames.push(knownIssue.testSuiteName);
      }
    }
    return listOfKnownIssuesNames;
  };
}

module.exports = { makeRetrieveListOfKnownIssuesNames };
