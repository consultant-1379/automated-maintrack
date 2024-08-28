const logger = require('./../../logger/logger');

function makeCheckIfDeliveryGroupContainsBugOrTR() {
  return function checkIfDeliveryGroupContainsBugOrTR(queuedDeliveryGroup) {
    if (queuedDeliveryGroup.bugOrTR === 'True') {
      logger.info('As the DeliveryGroup contains Bug or TRs returning True');
      return true;
    }
    logger.info('As the DeliveryGroup does not contain any Bug or TR returning False..');
    return false;
  };
}

module.exports = { makeCheckIfDeliveryGroupContainsBugOrTR };
