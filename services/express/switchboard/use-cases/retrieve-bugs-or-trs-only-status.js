function makeRetrieveBugsAndTRsOnlyStatus(listSwitchboard) {
  return async function retrieveBugsAndTRsOnlyStatus() {
    const switchboard = await listSwitchboard();
    if (!switchboard || switchboard.length === 0) {
      throw new Error('No switchboard detected. Please investigate.');
    }
    const { bugsAndTRsOnlyStatus } = switchboard[0];
    if (!bugsAndTRsOnlyStatus) {
      throw new Error('Failed to retrieve bugsAndTRsOnlyStatus.');
    }
    return bugsAndTRsOnlyStatus;
  };
}

module.exports = { makeRetrieveBugsAndTRsOnlyStatus };
