function makeCheckForPendingProductSets(slotService) {
  return async function checkForPendingProductSets() {
    const ongoingSlots = await slotService.searchForSlots({ slotStatus: 'ongoing' });
    if (ongoingSlots && ongoingSlots.length > 0) {
      ongoingSlots.forEach((ongoingSlot) => {
        if (ongoingSlot.productSetVersion === 'pending') {
          throw new Error('There is a slot currently pending product set creation, therefore cannot kick off slot.');
        }
      });
    }
  };
}

module.exports = {
  makeCheckForPendingProductSets,
};
