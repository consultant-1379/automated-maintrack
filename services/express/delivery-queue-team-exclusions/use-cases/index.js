const { makeCreateExcludedTeam } = require('./create-excluded-team');
const { makeListExcludedTeams } = require('./list-excluded-teams');
const { makeSearchForExcludedTeams } = require('./search-excluded-teams');
const { makeRemoveExcludedTeam } = require('./remove-excluded-team');
const { makeRetrieveListOfExcludedTeamsNames } = require('./retrieve-list-of-excluded-teams-names');
const { dbOperator } = require('../../data-access');

const { createExcludedTeam } = require('../entities');

const createNewExcludedTeam = makeCreateExcludedTeam(dbOperator, createExcludedTeam);
const listExcludedTeams = makeListExcludedTeams(dbOperator);
const searchForExcludedTeams = makeSearchForExcludedTeams(dbOperator);
const removeExcludedTeam = makeRemoveExcludedTeam(dbOperator);
const retrieveListOfExcludedTeamsNames = makeRetrieveListOfExcludedTeamsNames(dbOperator);

const excludedTeamsService = Object.freeze({
  createNewExcludedTeam,
  listExcludedTeams,
  searchForExcludedTeams,
  removeExcludedTeam,
  retrieveListOfExcludedTeamsNames,
});

module.exports = {
  excludedTeamsService,
  createNewExcludedTeam,
  listExcludedTeams,
  searchForExcludedTeams,
  removeExcludedTeam,
  retrieveListOfExcludedTeamsNames,
};
