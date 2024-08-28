function makeDeleteExcludedTeam({ removeExcludedTeam }) {
  return async function deleteExcludedTeam(httpRequest) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      await removeExcludedTeam({ id: httpRequest.params.id });
      return {
        headers,
        statusCode: 200,
        body: 'Deleted Excluded team',
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

module.exports = { makeDeleteExcludedTeam };
