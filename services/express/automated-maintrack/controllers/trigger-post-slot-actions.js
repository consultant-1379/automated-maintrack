function makeTriggerPostSlotActions(postSlotActions) {
  return async function triggerPostSlotActions(httpRequest) {
    try {
      const patchedSlot = await postSlotActions('Post Slot Action', 24, 5, process.env.PRODUCT_SET_CREATION_FLOW_JOB, httpRequest.params.id, httpRequest.body);

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

module.exports = { makeTriggerPostSlotActions };
