function makePostExcludedTeam({ createNewExcludedTeam }) {
  return async function postExcludedTeam(httpRequest) {
    try {
      const { ...ExcludedTeamInfo } = httpRequest.body;

      const postedExcludedTeam = await createNewExcludedTeam({ ...ExcludedTeamInfo });

      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': postedExcludedTeam.modifiedOn,
        },
        statusCode: 201,
        body: { postedExcludedTeam },
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

module.exports = { makePostExcludedTeam };
