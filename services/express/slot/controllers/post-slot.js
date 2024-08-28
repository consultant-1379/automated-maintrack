function makePostSlot({ createNewSlot }) {
  return async function postSlot(httpRequest) {
    try {
      const { ...slotInfo } = httpRequest.body;

      const postedSlot = await createNewSlot({ ...slotInfo });

      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(postedSlot.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: { postedSlot },
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

module.exports = { makePostSlot };
