const { makePostExcludedTeam } = require('./post-excluded-team');
const { makeGetExcludedTeams } = require('./get-excluded-teams');
const { makeSearchExcludedTeams } = require('./search-excluded-teams');
const { makeDeleteExcludedTeam } = require('./delete-excluded-team');

const {
  createNewExcludedTeam,
  listExcludedTeams,
  searchForExcludedTeams,
  removeExcludedTeam,
} = require('../use-cases');

const postExcludedTeam = makePostExcludedTeam({ createNewExcludedTeam });
const getExcludedTeams = makeGetExcludedTeams({ listExcludedTeams });
const searchExcludedTeams = makeSearchExcludedTeams({ searchForExcludedTeams });
const deleteExcludedTeam = makeDeleteExcludedTeam({ removeExcludedTeam });

const excludedTeamController = Object.freeze({
  postExcludedTeam,
  getExcludedTeams,
  searchExcludedTeams,
  deleteExcludedTeam,
});

module.exports = {
  excludedTeamController,
  postExcludedTeam,
  getExcludedTeams,
  searchExcludedTeams,
  deleteExcludedTeam,
};
