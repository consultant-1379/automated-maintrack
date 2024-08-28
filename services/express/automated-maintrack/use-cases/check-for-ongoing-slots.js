function makeCheckForOngoingSlots(slotService) {
  return async function checkForOngoingSlots(acceptedNumberOfRunningSlots) {
    const ongoingSlots = await slotService.searchForSlots({ slotStatus: 'ongoing' });
    if (ongoingSlots.length >= acceptedNumberOfRunningSlots) {
      throw new Error(`There is ${ongoingSlots.length} slots ongoing, therefore cannot kick off slot`);
    }
  };
}

module.exports = {
  makeCheckForOngoingSlots,
};
