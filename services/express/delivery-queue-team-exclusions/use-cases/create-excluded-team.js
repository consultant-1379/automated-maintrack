function makeCreateExcludedTeam(ExcludedTeamDb, createExcludedTeam) {
  return async function addExcludedTeam(ExcludedTeamInfo) {
    const excludedTeam = createExcludedTeam(ExcludedTeamInfo);
    return ExcludedTeamDb.insert({
      id: excludedTeam.getId(),
      teamName: excludedTeam.getTeamName(),
      jiraUrls: excludedTeam.getJiraUrls(),
      signum: excludedTeam.getSignum(),
      createdOn: excludedTeam.getCreatedOn(),
      modifiedOn: excludedTeam.getModifiedOn(),
    }, 'excludedTeams');
  };
}

module.exports = { makeCreateExcludedTeam };
