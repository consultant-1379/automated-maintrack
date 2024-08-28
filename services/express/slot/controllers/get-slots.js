function makeGetSlots({ listSlots }) {
  return async function getSlots() {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const slotsRetrieved = await listSlots({});
      return {
        headers,
        statusCode: 200,
        body: slotsRetrieved,
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

module.exports = { makeGetSlots };
