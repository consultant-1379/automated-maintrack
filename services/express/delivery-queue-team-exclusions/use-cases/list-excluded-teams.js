function makeListExcludedTeams(ExcludedTeamDb) {
  return async function listExcludedTeams() {
    return ExcludedTeamDb.findAll('excludedTeams');
  };
}

module.exports = { makeListExcludedTeams };
