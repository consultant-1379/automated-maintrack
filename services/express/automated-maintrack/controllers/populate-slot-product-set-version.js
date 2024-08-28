function makePopulateSlotProductSetVersion(populateAmtSlotProductSetVersion) {
  return async function populateSlotProductSetVersion(httpRequest) {
    try {
      const patchedSlot = await populateAmtSlotProductSetVersion(httpRequest.params.id, httpRequest.body);

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: patchedSlot,
      };
    } catch (error) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 500,
        body: {
          error: error.message,
        },
      };
    }
  };
}

module.exports = { makePopulateSlotProductSetVersion };
