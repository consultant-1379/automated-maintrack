function makePatchSwitchboard({ modifySwitchboard }) {
  return async function patchSwitchboard(httpRequest) {
    try {
      const { ...switchboardInfo } = httpRequest.body;
      const switchboardDataToEdit = {
        ...switchboardInfo,
      };

      const patchedSwitchboard = await modifySwitchboard(switchboardDataToEdit);

      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(patchedSwitchboard.modifiedOn).toUTCString(),
        },
        statusCode: 200,
        body: { patchedSwitchboard },
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

module.exports = { makePatchSwitchboard };
