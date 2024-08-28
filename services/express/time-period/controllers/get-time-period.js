function makeGetTimePeriod({ listTimePeriod }) {
  return async function getTimePeriod() {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const retrievedTimePeriod = await listTimePeriod({});
      return {
        headers,
        statusCode: 200,
        body: retrievedTimePeriod,
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

module.exports = { makeGetTimePeriod };
