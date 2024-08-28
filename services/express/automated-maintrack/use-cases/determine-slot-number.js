const logger = require('./../../logger/logger');

function makeDeteremineSlotNumber(slotService, sendEmailService, failureTrackerService) {
  return async function determineSlotNumber(fullSlotList, failureTracker) {
    let slotTriggerError = '';
    const queryInfo = 'Action /Unable to trigger AMT slot';
    const loggingTags = { query: queryInfo };
    const ongoingSlots = await slotService.searchForSlots({ slotStatus: 'ongoing' });
    let newSlotNumber = '';
    if (fullSlotList.length === 0) {
      newSlotNumber = 'first';
    } else if (fullSlotList[fullSlotList.length - 1].slotNumber === '') {
      newSlotNumber = 'first';
    } else if (!('slotNumber' in fullSlotList[fullSlotList.length - 1])) {
      newSlotNumber = 'first';
    }
    if (newSlotNumber.length === 0) {
      const lastSlotNumber = fullSlotList[fullSlotList.length - 1].slotNumber;
      if (ongoingSlots.length === 0) {
        newSlotNumber = 'first';
      } else if (ongoingSlots.length === 1) {
        if (ongoingSlots[0].slotNumber === 'first') {
          if (lastSlotNumber === 'second') {
            slotTriggerError += 'AMT Could not trigger another slot as the first slot within a parallel slot coupling is still ongoing.';
            if (slotTriggerError) {
              await failureTrackerService.addToFailureTracker(failureTracker, slotTriggerError, 'upgrade');
              if (await failureTrackerService.checkMaxFailureCountReached(failureTracker, Number(process.env.FAILURE_TRACKER_COUNT))) {
                logger.error(loggingTags, slotTriggerError);
                await sendEmailService.sendTriggerSlotCoupleErrorMail();
                await failureTrackerService.resetFailureTracker(failureTracker, 'upgrade');
              }
            }
            throw new Error(slotTriggerError);
          } else if (lastSlotNumber === 'first') {
            newSlotNumber = 'second';
          }
        } else if (ongoingSlots[0].slotNumber === 'second') {
          newSlotNumber = 'first';
        }
      }
    } else {
      newSlotNumber = 'first';
    }
    return newSlotNumber;
  };
}

module.exports = {
  makeDeteremineSlotNumber,
};
