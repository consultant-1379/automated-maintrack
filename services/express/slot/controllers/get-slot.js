function makeGetSlot({ listSlot }) {
  return async function getSlot(httpRequest) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const retrievedSlot = await listSlot({ id: httpRequest.params.id });
      return {
        headers,
        statusCode: 200,
        body: retrievedSlot,
      };
    } catch (error) {
      return {
        headers,
        statusCode: 400,
        body: {
          error: error.message,
        },
      };
    }
  };
}

module.exports = { makeGetSlot };
