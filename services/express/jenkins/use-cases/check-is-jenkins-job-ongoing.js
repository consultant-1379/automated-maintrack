function makeCheckIsJenkinsJobOngoing(getJenkinsJob, functionalUserIsAvailableOrTesting) {
  function findChild(parentObject, ...args) {
    return args.reduce((object, property) => object && object[property], parentObject);
  }

  function areDefined(...args) {
    if ([true, ...args].reduce((previous, current) => previous && current)) return true;
    return false;
  }

  return async function checkIsJenkinsJobOngoing(jobName) {
    const ENVS_TO_BLOCK = ['PROD', 'TEST', 'TEST_LOCAL_MONGO'];
    if (functionalUserIsAvailableOrTesting()) {
      const jobData = await getJenkinsJob(jobName);
      const lastBuildNumber = findChild(jobData, 'lastBuild', 'number');
      const lastCompletedBuildNumber = findChild(jobData, 'lastCompletedBuild', 'number');
      return new Promise((resolve, reject) => {
        if (areDefined(lastBuildNumber, lastCompletedBuildNumber)) {
          const lastBuildFinished = (lastBuildNumber === lastCompletedBuildNumber);
          const nonBlockingNodeEnv = !ENVS_TO_BLOCK.includes(process.env.NODE_ENV);
          if (lastBuildFinished || nonBlockingNodeEnv) resolve(false);
          resolve(true);
        }
        reject(new Error(`Either lastBuildNumber (${lastBuildNumber}) or lastCompletedBuildNumber (${lastCompletedBuildNumber}) were undefined.\
                          These values are required to check if the Jenkins job (${jobName}) is ongoing.`));
      });
    }
    console.log('DEV: Got jenkins build status: %s', jobName);
  };
}

module.exports = { makeCheckIsJenkinsJobOngoing };
