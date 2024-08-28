function makeDeleteKnownIssue({ removeKnownIssue }) {
  return async function deleteKnownIssue(httpRequest) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      await removeKnownIssue({ id: httpRequest.params.id });
      return {
        headers,
        statusCode: 200,
        body: 'Deleted known issue',
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

module.exports = { makeDeleteKnownIssue };
