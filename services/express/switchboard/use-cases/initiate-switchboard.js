function makeInitiateSwitchboard(listSwitchboard, createNewSwitchboard) {
  return async function initiateSwitchboard() {
    const switchboard = await listSwitchboard();
    if (!switchboard) {
      throw new Error('Failed to retrieve number of switchboards in the database when trying to initiate switchboards');
    }
    if (switchboard.length === 0) {
      await createNewSwitchboard();
    }
  };
}

module.exports = { makeInitiateSwitchboard };
