const jenkins = require('jenkins');
const { makeBuildJenkinsJob } = require('./build-jenkins-job');
const { makeGetJenkinsJob } = require('./get-jenkins-job');
const { makeGetJenkinsBuild } = require('./get-jenkins-build');
const { makeCheckIsJenkinsJobOngoing } = require('./check-is-jenkins-job-ongoing');
const { makeFunctionalUserIsAvailableOrTesting } = require('./check-is-functional-user-available-or-testing');

const jenkinsClient = jenkins({
  baseUrl:
      `https://${process.env.BB_FUNCTIONAL_USER}:${process.env.BB_FUNCTIONAL_USER_PASSWORD}@${process.env.JENKINS_URL}/jenkins`,
});

const functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
const getJenkinsJob = makeGetJenkinsJob(jenkinsClient, functionalUserIsAvailableOrTesting);
const getJenkinsBuild = makeGetJenkinsBuild(jenkinsClient, functionalUserIsAvailableOrTesting);
const checkIsJenkinsJobOngoing = makeCheckIsJenkinsJobOngoing(getJenkinsJob, functionalUserIsAvailableOrTesting);
const buildJenkinsJob = makeBuildJenkinsJob(jenkinsClient);

const jenkinsService = Object.freeze({
  buildJenkinsJob,
  getJenkinsJob,
  getJenkinsBuild,
  checkIsJenkinsJobOngoing,
});

module.exports = {
  jenkinsService,
  buildJenkinsJob,
  getJenkinsJob,
  getJenkinsBuild,
  checkIsJenkinsJobOngoing,
};
