function makeListKnownIssues(knownIssueDb) {
  return async function listKnownIssues() {
    return knownIssueDb.findAll('knownIssues');
  };
}

module.exports = { makeListKnownIssues };
