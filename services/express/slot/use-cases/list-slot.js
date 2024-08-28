function makeListSlot(slotsDb) {
  return async function listSlot(slotId) {
    if (!slotId.id) {
      throw new Error('You must specify a slot id.');
    }
    return slotsDb.findById(slotId.id, 'slots');
  };
}

module.exports = { makeListSlot };
