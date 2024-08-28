const logger = require('./../../../../logger/logger');

function makeOrchestrateSlotObsoletionPredictions(knownIssuesService, slotService) {
  return async function orchestrateSlotObsoletionPredictions(slot) {
    const queryInfo = 'Action /Prediction Slot';
    const loggingTags = { query: queryInfo, id: slot.id };
    const listOfKnownIssuesNames = await knownIssuesService.retrieveListOfKnownIssuesNames();
    const predictions = await slotService.predictSlotObsoletions(slot, listOfKnownIssuesNames);
    logger.debug(loggingTags, `Predictions: = ${JSON.stringify(predictions)}`);
    const updatedSlot = await slotService.updateSlot({ id: slot.id, dgObsoletionPredictions: predictions });
    logger.debug(loggingTags, `Slot After Predictions: = ${JSON.stringify(updatedSlot)}`);
    return { predictions, updatedSlot };
  };
}

module.exports = { makeOrchestrateSlotObsoletionPredictions };
