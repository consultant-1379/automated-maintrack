function makeSearchSlots({ searchForSlots }) {
  return async function searchSlots(httpRequest) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const slotsRetrieved = await searchForSlots(httpRequest.query);
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

module.exports = { makeSearchSlots };
