function buildMakeExcludedTeam({ Id }) {
  return function makeExcludedTeam({
    id = Id.makeId(),
    teamName,
    jiraUrls,
    signum,
    createdOn = new Date(Date.now()).toUTCString(),
    modifiedOn = new Date(Date.now()).toUTCString(),
  } = {}) {
    if (!Id.isValidId(id)) {
      throw new Error('Excluded team must have a valid id.');
    }

    if (!teamName) {
      throw new Error('You must provide a teamName value.');
    }

    if (!signum) {
      throw new Error('You must provide a signum value.');
    }

    if (!jiraUrls) {
      jiraUrls = [];
    }

    return Object.freeze({
      getTeamName: () => teamName,
      getJiraUrls: () => jiraUrls,
      getSignum: () => signum,
      getId: () => id,
      getCreatedOn: () => createdOn,
      getModifiedOn: () => modifiedOn,
    });
  };
}

module.exports = { buildMakeExcludedTeam };
