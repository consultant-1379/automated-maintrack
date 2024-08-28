function makePostKnownIssue({ createNewKnownIssue }) {
  return async function postKnownIssue(httpRequest) {
    try {
      const { ...knownIssueInfo } = httpRequest.body;

      const postedKnownIssue = await createNewKnownIssue({ ...knownIssueInfo });

      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': postedKnownIssue.modifiedOn,
        },
        statusCode: 201,
        body: { postedKnownIssue },
      };
    } catch (error) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: error.message,
        },
      };
    }
  };
}

module.exports = { makePostKnownIssue };
