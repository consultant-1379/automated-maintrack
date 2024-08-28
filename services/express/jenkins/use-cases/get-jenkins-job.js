function makeGetJenkinsJob(jenkinsClient, functionalUserIsAvailableOrTesting) {
  return function getJenkinsJob(jobName) {
    if (functionalUserIsAvailableOrTesting()) {
      return new Promise((resolve, reject) => {
        jenkinsClient.job.get({
          name: jobName,
        }, (err, jobData) => {
          if (err) reject(err);
          resolve(jobData);
        });
      });
    }
    console.log('DEV: Got job data: %s', jobName);
  };
}

module.exports = { makeGetJenkinsJob };
