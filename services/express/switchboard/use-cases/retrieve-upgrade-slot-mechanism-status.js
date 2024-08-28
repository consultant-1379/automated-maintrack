function makeRetrieveUpgradeSlotMechanismStatus(listSwitchboard) {
  return function retrieveUpgradeSlotMechanismStatus() {
    const switchboard = listSwitchboard();
    if (!switchboard || switchboard.length === 0) {
      throw new Error('No switchboard detected. Please investigate.');
    }
    const { upgradeSlotMechanismStatus } = switchboard[0];
    if (!upgradeSlotMechanismStatus) {
      throw new Error('Failed to retrieve upgradeSlotMechanismStatus.');
    }
    return upgradeSlotMechanismStatus;
  };
}

module.exports = { makeRetrieveUpgradeSlotMechanismStatus };
