function makeRetrieveE2eSlotCompletionDGObsoletionBehaviour(listSwitchboard) {
  return async function retrieveE2eSlotCompletionDGObsoletionBehaviour() {
    const switchboard = await listSwitchboard();
    if (!switchboard || switchboard.length === 0) {
      throw new Error('No switchboard detected. Please investigate.');
    }
    const { e2eSlotCompletionDGObsoletionBehaviour } = switchboard[0];
    if (!e2eSlotCompletionDGObsoletionBehaviour) {
      throw new Error('Failed to retrieve e2eSlotCompletionDGObsoletionBehaviour.');
    }
    return e2eSlotCompletionDGObsoletionBehaviour;
  };
}

module.exports = { makeRetrieveE2eSlotCompletionDGObsoletionBehaviour };
