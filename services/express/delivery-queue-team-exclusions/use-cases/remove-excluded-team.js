function makeRemoveExcludedTeam(ExcludedTeamDb) {
  return async function removeExcludedTeam(excludedTeamId) {
    if (!excludedTeamId.id) {
      throw new Error('You must specify a id.');
    }
    return ExcludedTeamDb.remove({
      id: excludedTeamId.id,
    }, 'excludedTeams');
  };
}

module.exports = { makeRemoveExcludedTeam };
