require('../../../config/config');
const expect = require('expect');
const nock = require('nock');
const request = require('superagent');

const emtUrl = process.env.EMT_URL;

const { buildRetrieveCandidatePhysicalEnvironments } = require('../../use-cases/retrieve-candidate-physical-environment');

describe('Unit Test: Retrieve candidate physical environment use case', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  it('must include a testPhase', (done) => {
    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '402',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    retrieveCandidatePhysicalEnvironments('IDLE', '', 'oldest').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a state', (done) => {
    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '402',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    retrieveCandidatePhysicalEnvironments('', 'CDL', 'oldest').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a versioningOrder', (done) => {
    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '402',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    retrieveCandidatePhysicalEnvironments('IDLE', 'CDL', '').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a state and a testPhase', (done) => {
    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '402',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    retrieveCandidatePhysicalEnvironments('', '', 'oldest').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a state and a versioningOrder', (done) => {
    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '402',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    retrieveCandidatePhysicalEnvironments('', 'CDL', '').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a testPhase and a versioningOrder', (done) => {
    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '402',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    retrieveCandidatePhysicalEnvironments('BUSY', '', '').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a state, a versioningOrder and a testPhase', (done) => {
    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '402',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    retrieveCandidatePhysicalEnvironments('', '', '').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a valid versioningOrder 1', (done) => {
    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '402',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    retrieveCandidatePhysicalEnvironments('IDLE', 'CDL', 'newest').catch((error) => {
      expect(error.message).toBe('You must use either latest or oldest for the versioningOrder value.');
    })
      .then(done, done);
  });
  it('must include a valid versioningOrder 2', (done) => {
    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '402',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    retrieveCandidatePhysicalEnvironments('IDLE', 'CDL', 'LATEST').catch((error) => {
      expect(error.message).toBe('You must use either latest or oldest for the versioningOrder value.');
    })
      .then(done, done);
  });
  it('must include a valid versioningOrder 3', (done) => {
    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '402',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    retrieveCandidatePhysicalEnvironments('IDLE', 'CDL', 'Oldest').catch((error) => {
      expect(error.message).toBe('You must use either latest or oldest for the versioningOrder value.');
    })
      .then(done, done);
  });
  it('must include a valid versioningOrder 4', (done) => {
    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '402',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    retrieveCandidatePhysicalEnvironments('IDLE', 'CDL', 'latesT').catch((error) => {
      expect(error.message).toBe('You must use either latest or oldest for the versioningOrder value.');
    })
      .then(done, done);
  });
  it('should expect an error when request return fails', (done) => {
    nock(emtUrl)
      .get('/api/deployments/search?q=state=QUARANTINE&q=testPhase=CDL&q=platformType=physical&q=systemHealthCheckStatus=COMPLETED')
      .replyWithError('Request has failed');

    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '402',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    retrieveCandidatePhysicalEnvironments('QUARANTINE', 'CDL', 'latest').catch((error) => {
      expect(error.message).toBe('Error: Request has failed');
    })
      .then(done, done);
  });
  it('should retrieve the latest MTE IDLE physical environment', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=state=IDLE&q=testPhase=MTE&q=platformType=physical&q=systemHealthCheckStatus=COMPLETED')
      .reply(200, [{
        name: '297',
        productSet: '19.04.11',
      }, {
        name: '306',
        productSet: '19.04.10',
      }, {
        name: '339',
        productSet: '19.03.11',
      }, {
        name: '402',
        productSet: '19.05.11',
      }]);

    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '402',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    const candidateEnvironment = await retrieveCandidatePhysicalEnvironments('IDLE', 'MTE', 'latest');
    expect(candidateEnvironment.candidatePhysicalVersioningTestEnvironment.name).toBe('402');
    expect(candidateEnvironment.candidatePhysicalVersioningTestEnvironment.clusterType).toBe('any');
  });
  it('should retrieve the oldest MTE IDLE physical environment', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=state=IDLE&q=testPhase=MTE&q=platformType=physical&q=systemHealthCheckStatus=COMPLETED')
      .reply(200, [{
        name: '297',
        productSet: '19.04.11',
      }, {
        name: '306',
        productSet: '19.04.10',
      }, {
        name: '339',
        productSet: '19.03.11',
      }, {
        name: '402',
        productSet: '19.05.11',
      }]);

    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '339',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    const candidateEnvironment = await retrieveCandidatePhysicalEnvironments('IDLE', 'MTE', 'oldest');
    expect(candidateEnvironment.candidatePhysicalVersioningTestEnvironment.name).toBe('339');
    expect(candidateEnvironment.candidatePhysicalVersioningTestEnvironment.clusterType).toBe('any');
  });
  it('should retrieve the automation MTE IDLE physical environment', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=state=IDLE&q=testPhase=MTE&q=platformType=physical&q=systemHealthCheckStatus=COMPLETED')
      .reply(200, [{
        name: '297',
        productSet: '19.04.11',
      }, {
        name: '306',
        productSet: '19.04.11',
      }, {
        name: '339',
        productSet: '19.03.11',
      }]);


    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '339',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack_aut' },
        },
      },
    );

    const candidateEnvironment = await retrieveCandidatePhysicalEnvironments('IDLE', 'MTE', 'latest');
    expect(candidateEnvironment.candidatePhysicalAutTestEnvironment.name).toBe('297');
    expect(candidateEnvironment.candidatePhysicalAutTestEnvironment.clusterType).toBe('automation');
  });
  it('should retrieve the events MTE IDLE physical environment', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=state=IDLE&q=testPhase=MTE&q=platformType=physical&q=systemHealthCheckStatus=COMPLETED')
      .reply(200, [{
        name: '297',
        productSet: '19.04.11',
      }, {
        name: '306',
        productSet: '19.04.11',
      }, {
        name: '339',
        productSet: '19.03.11',
      }]);


    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '339',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack_evt' },
        },
      },
    );

    const candidateEnvironment = await retrieveCandidatePhysicalEnvironments('IDLE', 'MTE', 'latest');
    expect(candidateEnvironment.candidatePhysicalEvtsTestEnvironment.name).toBe('297');
    expect(candidateEnvironment.candidatePhysicalEvtsTestEnvironment.clusterType).toBe('events');
  });
  it('should retrieve zero MTE QUARANTINE vENM environments', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=state=QUARANTINE&q=testPhase=MTE&q=platformType=physical&q=systemHealthCheckStatus=COMPLETED')
      .reply(200, []);

    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => undefined,
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    const candidateEnvironment = await retrieveCandidatePhysicalEnvironments('QUARANTINE', 'MTE', 'latest');
    expect(candidateEnvironment.candidateEnvironmentVersioningName).toBeUndefined();
  });
  it('should retrieve the name of one environment (1 key in Object) when 2 environments are on same latest product set version', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=state=QUARANTINE&q=testPhase=MTE&q=platformType=physical&q=systemHealthCheckStatus=COMPLETED')
      .reply(200, [{
        name: '297',
        productSet: '19.04.11',
      }, {
        name: '306',
        productSet: '19.04.11',
      }, {
        name: '339',
        productSet: '19.03.11',
      }]);


    const retrieveCandidatePhysicalEnvironments = buildRetrieveCandidatePhysicalEnvironments(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => '339',
        useExternalApiService: {
          useExternalApi: { getDeploymentDescription: () => 'medium__production_dualStack' },
        },
      },
    );

    const candidateEnvironment = await retrieveCandidatePhysicalEnvironments('QUARANTINE', 'MTE', 'latest');
    expect(Object.keys(candidateEnvironment).length).toEqual(3);
  });
});
