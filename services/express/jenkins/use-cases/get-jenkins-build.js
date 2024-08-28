function makeGetJenkinsBuild(jenkinsClient, functionalUserIsAvailableOrTesting) {
  return function getJenkinsBuild(jobName, buildNumber) {
    if (functionalUserIsAvailableOrTesting()) {
      return new Promise((resolve, reject) => {
        jenkinsClient.build.get({
          name: jobName,
          number: buildNumber,
        }, (err, buildData) => {
          if (err) reject(err);
          resolve(buildData);
        });
      });
    }
    console.log('DEV: Got job data: %s', jobName);
  };
}

module.exports = { makeGetJenkinsBuild };
