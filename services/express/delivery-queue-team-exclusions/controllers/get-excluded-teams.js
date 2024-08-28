function makeGetExcludedTeams({ listExcludedTeams }) {
  return async function getExcludedTeams() {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const excldudedTeamsRetrieved = await listExcludedTeams({});
      return {
        headers,
        statusCode: 200,
        body: excldudedTeamsRetrieved,
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

module.exports = { makeGetExcludedTeams };
