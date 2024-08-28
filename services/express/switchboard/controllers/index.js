const { makePatchSwitchboard } = require('./patch-switchboard');
const { makeGetSwitchboard } = require('./get-switchboard');

const {
  modifySwitchboard,
  listSwitchboard,
} = require('../use-cases');

const patchSwitchboard = makePatchSwitchboard({ modifySwitchboard });
const getSwitchboard = makeGetSwitchboard({ listSwitchboard });

const switchboardController = Object.freeze({
  patchSwitchboard,
  getSwitchboard,
});

module.exports = {
  switchboardController,
  patchSwitchboard,
  getSwitchboard,
};
