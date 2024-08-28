require('../../../config/config');
const expect = require('expect');
const nock = require('nock');
const request = require('superagent');

const emtUrl = process.env.EMT_URL;

const { buildRetrieveCandidateVenmEnvironment } = require('../../use-cases/retrieve-candidate-venm-environment');

describe('Unit Test: Retrieve candidate venm environment use case', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  it('must include a testPhase', (done) => {
    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc3b10',
      },
    );

    retrieveCandidateVenmEnvironment('IDLE', '', 'oldest').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a state', (done) => {
    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc3b10',
      },
    );

    retrieveCandidateVenmEnvironment('', 'CDL', 'oldest').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a versioningOrder', (done) => {
    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc3b10',
      },
    );

    retrieveCandidateVenmEnvironment('IDLE', 'CDL', '').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a state and a testPhase', (done) => {
    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc3b10',
      },
    );

    retrieveCandidateVenmEnvironment('', '', 'oldest').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a state and a versioningOrder', (done) => {
    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc3b10',
      },
    );

    retrieveCandidateVenmEnvironment('', 'CDL', '').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a testPhase and a versioningOrder', (done) => {
    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc3b10',
      },
    );

    retrieveCandidateVenmEnvironment('BUSY', '', '').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a state, a versioningOrder and a testPhase', (done) => {
    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc3b10',
      },
    );

    retrieveCandidateVenmEnvironment('', '', '').catch((error) => {
      expect(error.message).toBe('You must supply a state, a testPhase and a versioningOrder.');
    })
      .then(done, done);
  });
  it('must include a valid versioningOrder 1', (done) => {
    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc3b10',
      },
    );

    retrieveCandidateVenmEnvironment('IDLE', 'CDL', 'newest').catch((error) => {
      expect(error.message).toBe('You must use either latest or oldest for the versioningOrder value.');
    })
      .then(done, done);
  });
  it('must include a valid versioningOrder 2', (done) => {
    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc3b10',
      },
    );

    retrieveCandidateVenmEnvironment('IDLE', 'CDL', 'LATEST').catch((error) => {
      expect(error.message).toBe('You must use either latest or oldest for the versioningOrder value.');
    })
      .then(done, done);
  });
  it('must include a valid versioningOrder 3', (done) => {
    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc3b10',
      },
    );

    retrieveCandidateVenmEnvironment('IDLE', 'CDL', 'Oldest').catch((error) => {
      expect(error.message).toBe('You must use either latest or oldest for the versioningOrder value.');
    })
      .then(done, done);
  });
  it('must include a valid versioningOrder 4', (done) => {
    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc3b10',
      },
    );

    retrieveCandidateVenmEnvironment('IDLE', 'CDL', 'latesT').catch((error) => {
      expect(error.message).toBe('You must use either latest or oldest for the versioningOrder value.');
    })
      .then(done, done);
  });
  it('should expect an error when request return fails', (done) => {
    nock(emtUrl)
      .get('/api/deployments/search?q=state=QUARANTINE&q=testPhase=CDL&q=platformType=vENM&q=systemHealthCheckStatus=COMPLETED')
      .replyWithError('Request has failed');

    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc3b10',
      },
    );

    retrieveCandidateVenmEnvironment('QUARANTINE', 'CDL', 'latest').catch((error) => {
      expect(error.message).toBe('Error: Request has failed');
    })
      .then(done, done);
  });
  it('should retrieve the oldest MTE IDLE vENM environment', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=state=IDLE&q=testPhase=MTE&q=platformType=vENM&q=systemHealthCheckStatus=COMPLETED')
      .reply(200, [{
        name: 'ieatenmc3b10',
        productSet: '19.04.11',
      }, {
        name: 'ieatenmc7a12',
        productSet: '19.04.10',
      }, {
        name: 'ieatenmc6a11',
        productSet: '19.03.11',
      }, {
        name: 'ieatenmc4b09',
        productSet: '19.05.11',
      }]);

    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc6a11',
      },
    );

    const candidateEnvironment = await retrieveCandidateVenmEnvironment('IDLE', 'MTE', 'oldest');
    expect(candidateEnvironment.candidateEnvironmentName).toBe('ieatenmc6a11');
  });
  it('should retrieve the latest MTE IDLE vENM environment', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=state=IDLE&q=testPhase=MTE&q=platformType=vENM&q=systemHealthCheckStatus=COMPLETED')
      .reply(200, [{
        name: 'ieatenmc3b10',
        productSet: '19.04.11',
      }, {
        name: 'ieatenmc7a12',
        productSet: '19.04.10',
      }, {
        name: 'ieatenmc6a11',
        productSet: '19.03.11',
      }, {
        name: 'ieatenmc4b09',
        productSet: '19.05.11',
      }]);

    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc4b09',
      },
    );

    const candidateEnvironment = await retrieveCandidateVenmEnvironment('IDLE', 'MTE', 'latest');
    expect(candidateEnvironment.candidateEnvironmentName).toBe('ieatenmc4b09');
  });
  it('should retrieve zero MTE QUARANTINE vENM environments', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=state=QUARANTINE&q=testPhase=MTE&q=platformType=vENM&q=systemHealthCheckStatus=COMPLETED')
      .reply(200, []);

    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => undefined,
      },
    );

    const candidateEnvironment = await retrieveCandidateVenmEnvironment('QUARANTINE', 'MTE', 'latest');
    expect(candidateEnvironment.candidateEnvironmentName).toBeUndefined();
  });
  it('should retrieve the name of one environment (1 key in Object) when 2 environments are on same latest product set version', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=state=QUARANTINE&q=testPhase=MTE&q=platformType=vENM&q=systemHealthCheckStatus=COMPLETED')
      .reply(200, [{
        name: 'ieatenmc3b10',
        productSet: '19.04.11',
      }, {
        name: 'ieatenmc7a12',
        productSet: '19.04.11',
      }, {
        name: 'ieatenmc6a11',
        productSet: '19.03.11',
      }]);

    const retrieveCandidateVenmEnvironment = buildRetrieveCandidateVenmEnvironment(
      {
        request,
        emtUrl,
        findTestEnvironmentBasedOffVersionOrder: () => 'ieatenmc3b10',
      },
    );

    const candidateEnvironment = await retrieveCandidateVenmEnvironment('QUARANTINE', 'MTE', 'latest');
    expect(Object.keys(candidateEnvironment).length).toEqual(1);
  });
});
