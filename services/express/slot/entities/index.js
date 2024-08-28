const { buildMakeSlot } = require('./slot');
const { Id } = require('./../../Id');

const createSlot = buildMakeSlot({ Id });

module.exports = { createSlot };
