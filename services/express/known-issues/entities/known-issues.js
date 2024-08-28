function buildMakeKnownIssue({ Id }) {
  return function makeKnownIssue({
    id = Id.makeId(),
    testSuiteName,
    jiraUrls,
    signum,
    createdOn = new Date(Date.now()).toUTCString(),
    modifiedOn = new Date(Date.now()).toUTCString(),
  } = {}) {
    if (!Id.isValidId(id)) {
      throw new Error('Known issue must have a valid id.');
    }

    if (!testSuiteName) {
      throw new Error('You must provide a testSuiteName value.');
    }

    if (!signum) {
      throw new Error('You must provide a signum value.');
    }

    if (!jiraUrls) {
      jiraUrls = [];
    }

    return Object.freeze({
      getTestSuiteName: () => testSuiteName,
      getJiraUrls: () => jiraUrls,
      getSignum: () => signum,
      getId: () => id,
      getCreatedOn: () => createdOn,
      getModifiedOn: () => modifiedOn,
    });
  };
}

module.exports = { buildMakeKnownIssue };
