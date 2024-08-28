function makeRetrieveNumberOfDeliveryGroups(listSwitchboard) {
  return async function retrieveNumberOfDeliveryGroups() {
    const switchboard = await listSwitchboard();
    if (!switchboard || switchboard.length === 0) {
      throw new Error('No switchboard detected. Please investigate.');
    }
    const { numberOfDeliveryGroups } = switchboard[0];
    if (!numberOfDeliveryGroups) {
      throw new Error('Failed to retrieve numberOfDeliveryGroups.');
    }
    return numberOfDeliveryGroups;
  };
}

module.exports = { makeRetrieveNumberOfDeliveryGroups };
