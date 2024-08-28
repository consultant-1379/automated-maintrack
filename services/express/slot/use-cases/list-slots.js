function makeListSlots(slotsDb) {
  return async function listSlots() {
    return slotsDb.findAll('slots');
  };
}

module.exports = { makeListSlots };
