function makeSearchExcludedTeams({ searchForExcludedTeams }) {
  return async function searchExcludedTeams(httpRequest) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const excludedTeamsRetrieved = await searchForExcludedTeams(httpRequest.query);
      return {
        headers,
        statusCode: 200,
        body: excludedTeamsRetrieved,
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

module.exports = { makeSearchExcludedTeams };
