const { buildMakeExcludedTeam } = require('./excluded-teams');
const { Id } = require('./../../Id');

const createExcludedTeam = buildMakeExcludedTeam({ Id });

module.exports = { createExcludedTeam };
