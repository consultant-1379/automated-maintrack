function makeDeleteTimePeriod({ removeTimePeriod }) {
  return async function deleteTimePeriod(httpRequest) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      await removeTimePeriod({ id: httpRequest.params.id });
      return {
        headers,
        statusCode: 200,
        body: 'Deleted time period',
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

module.exports = { makeDeleteTimePeriod };
