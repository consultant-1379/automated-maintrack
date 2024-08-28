function makeListSwitchboard(switchboardDb) {
  return function listSwitchboard() {
    return switchboardDb.findAll('switchboards');
  };
}

module.exports = { makeListSwitchboard };
