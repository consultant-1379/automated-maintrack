function makeRetrieveSlotUgFailureBehaviour(listSwitchboard) {
  return async function retrieveSlotUgFailureBehaviour() {
    const switchboard = await listSwitchboard();
    if (!switchboard || switchboard.length === 0) {
      throw new Error('No switchboard detected. Please investigate.');
    }
    const { slotUgFailureBehaviour } = switchboard[0];
    if (!slotUgFailureBehaviour) {
      throw new Error('Failed to retrieve slotUgFailureBehaviour.');
    }
    return slotUgFailureBehaviour;
  };
}

module.exports = { makeRetrieveSlotUgFailureBehaviour };
