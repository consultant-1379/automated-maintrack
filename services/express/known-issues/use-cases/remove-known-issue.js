function makeRemoveKnownIssue(knownIssueDb) {
  return async function removeKnownIssue(knownIssueId) {
    if (!knownIssueId.id) {
      throw new Error('You must specify a id.');
    }
    return knownIssueDb.remove({
      id: knownIssueId.id,
    }, 'knownIssues');
  };
}

module.exports = { makeRemoveKnownIssue };
