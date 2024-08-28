function makeSearchKnownIssues({ searchForKnownIssues }) {
  return async function searchKnownIssues(httpRequest) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const knownIssuesRetrieved = await searchForKnownIssues(httpRequest.query);
      return {
        headers,
        statusCode: 200,
        body: knownIssuesRetrieved,
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

module.exports = { makeSearchKnownIssues };
