function makePredictSlotObsoletions(exec) {
  return function predictSlotObsoletions(slotInfo, knownIssuesInfo) {
    const slotInfoFormatted = JSON.stringify(slotInfo).replace(/"/g, '\\"');
    const knownIssuesFormatted = JSON.stringify(knownIssuesInfo).replace(/"/g, '\\"');
    const scriptPath = '/usr/src/app/machine_learning/determine_obsoletions.py';
    const pythonCommand = `"python '${scriptPath}' -s '${slotInfoFormatted}' -ki '${knownIssuesFormatted}' -e ${process.env.NODE_ENV}"`;
    const sshCommand = `
    sshpass -p ${process.env.PYTHON_PASSWORD} ssh -o UserKnownHostsFile=/dev/null -o CheckHostIP=no -o StrictHostKeyChecking=no root@python `;
    const pythonScriptOutput = exec(sshCommand + pythonCommand).toString('utf8');
    const listOfPredictionOutput = pythonScriptOutput.split('AMT_PREDICTIONS_DELIMITER');
    if (listOfPredictionOutput.length !== 3) {
      throw new Error('Output from python container is not in expected format');
    }
    const predictionOutputString = listOfPredictionOutput[1].replace(/'/g, '"');
    return JSON.parse(predictionOutputString);
  };
}

module.exports = { makePredictSlotObsoletions };
