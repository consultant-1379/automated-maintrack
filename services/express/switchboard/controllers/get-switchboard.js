function makeGetSwitchboard({ listSwitchboard }) {
  return async function getSwitchboard() {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const switchboardRetrieved = await listSwitchboard({});
      return {
        headers,
        statusCode: 200,
        body: switchboardRetrieved,
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

module.exports = { makeGetSwitchboard };
