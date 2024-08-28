function makeBuildJenkinsJob(jenkinsClient) {
  return function buildJenkinsJob(jobName, jobParams) {
    if (process.env.NODE_ENV === 'PROD' && process.env.BB_FUNCTIONAL_USER && process.env.BB_FUNCTIONAL_USER_PASSWORD) {
      jenkinsClient.job.build({
        name: jobName,
        parameters: jobParams,
      }, (err) => {
        if (err) throw err;
      });
    } else {
      console.log('DEV: Kicked off master job!');
    }
  };
}

module.exports = { makeBuildJenkinsJob };
