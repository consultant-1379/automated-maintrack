function makeGetKnownIssues({ listKnownIssues }) {
  return async function getKnownIssues() {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const knownIssuesRetrieved = await listKnownIssues({});
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

module.exports = { makeGetKnownIssues };
