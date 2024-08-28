function buildCheckAmtServiceToTriggerSlot(listSwitchboard, triggerUpgradeSequentialSlot, triggerUpgradeParallelSlot) {
  return async function checkAmtServiceToTriggerSlot() {
    const switchboard = await listSwitchboard();
    if (!switchboard || switchboard.length === 0) {
      throw new Error('Failed to retrieve switchboard.');
    }
    const { amtTriggerStatus } = switchboard[0];
    if (!amtTriggerStatus) {
      throw new Error('There is no amtTriggerStatus in the switchboard.');
    }
    const { upgradeSlotMechanismStatus } = switchboard[0];
    if (!upgradeSlotMechanismStatus) {
      throw new Error('There is no upgradeSlotMechanismStatus in the switchboard.');
    }
    if (amtTriggerStatus === 'on') {
      if (upgradeSlotMechanismStatus === 'parallel') {
        await triggerUpgradeParallelSlot();
      } else if (upgradeSlotMechanismStatus === 'sequential') {
        await triggerUpgradeSequentialSlot();
      }
    }
  };
}

module.exports = { buildCheckAmtServiceToTriggerSlot };
