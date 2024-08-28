function makeRetrieveListOfExcludedTeamsNames(ExcludedTeamDb) {
  return async function retrieveListOfExcludedTeamsNames() {
    const excludedTeams = await ExcludedTeamDb.findAll('excludedTeams');
    const listOfExcludedTeamNames = [];
    if (excludedTeams.length > 0) {
      for (const excludedTeam of excludedTeams) {
        listOfExcludedTeamNames.push(excludedTeam.teamName);
      }
    }
    return listOfExcludedTeamNames;
  };
}

module.exports = { makeRetrieveListOfExcludedTeamsNames };
