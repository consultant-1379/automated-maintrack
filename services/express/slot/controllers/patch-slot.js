function makePatchSlot({ modifySlot }) {
  return async function patchSlot(httpRequest) {
    try {
      const { ...slotInfo } = httpRequest.body;
      const slotDataToEdit = {
        ...slotInfo,
        id: httpRequest.params.id,
      };

      const patchedSlot = await modifySlot(slotDataToEdit);

      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(patchedSlot.modifiedOn).toUTCString(),
        },
        statusCode: 200,
        body: { patchedSlot },
      };
    } catch (error) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: error.message,
        },
      };
    }
  };
}

module.exports = { makePatchSlot };
