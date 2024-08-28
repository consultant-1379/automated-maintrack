function makePostTimePeriod({ createNewTimePeriod }) {
  return async function postTimePeriod(httpRequest) {
    try {
      const { ...timePeriodInfo } = httpRequest.body;

      const postedTimePeriod = await createNewTimePeriod({ ...timePeriodInfo });

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: { postedTimePeriod },
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

module.exports = { makePostTimePeriod };
