const { buildMakeSwitchboard } = require('./switchboard');
const { Id } = require('../../Id');

const createSwitchboard = buildMakeSwitchboard({ Id });

module.exports = { createSwitchboard };
