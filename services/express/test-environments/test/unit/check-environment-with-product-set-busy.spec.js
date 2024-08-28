require('../../../config/config');
const expect = require('expect');
const nock = require('nock');
const request = require('superagent');

const emtUrl = process.env.EMT_URL;

const { buildVerifyEnvironmentStateBusyWithExpectedProductSetVersion } = require('../../use-cases/check-environment-with-product-set-busy');

describe('Unit Test: Check environment with specified product set is BUSY use case', () => {
  const verifyEnvironmentStateBusyWithExpectedProductSetVersion = buildVerifyEnvironmentStateBusyWithExpectedProductSetVersion(request, emtUrl);

  afterEach(() => {
    nock.cleanAll();
  });

  it('should fail if environmentName not included when checking if environment busy with the specified product set', (done) => {
    verifyEnvironmentStateBusyWithExpectedProductSetVersion('', '20.10.12').catch((error) => {
      expect(error.message).toBe('You must supply an environmentName and a productSetVersion when checking if there is an environment busy with the specified product set');
    })
      .then(done, done);
  });

  it('should fail if productSetVersion not included when checking if environment busy with the specified product set', (done) => {
    verifyEnvironmentStateBusyWithExpectedProductSetVersion('339', '').catch((error) => {
      expect(error.message).toBe('You must supply an environmentName and a productSetVersion when checking if there is an environment busy with the specified product set');
    })
      .then(done, done);
  });

  it('should return an error when request return fails', (done) => {
    nock(emtUrl)
      .get('/api/deployments/search?q=name=339')
      .replyWithError('Request has failed');

    verifyEnvironmentStateBusyWithExpectedProductSetVersion('339', '20.10.12').catch((error) => {
      expect(error.message).toBe('Error: Request has failed');
    })
      .then(done, done);
  });

  it('should return true if environments productSet mathes what was passed in and environment is in a BUSY state', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=name=339')
      .reply(200, [{
        name: '339',
        productSet: '20.10.12',
        state: 'BUSY',
      }]);

    const result = await verifyEnvironmentStateBusyWithExpectedProductSetVersion('339', '20.10.12');
    expect(result).toBe(true);
  });

  it('should return false if environments productSet does not match that which was passed in', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=name=339')
      .reply(200, [{
        name: '339',
        productSet: '20.10.20',
        state: 'BUSY',
      }]);

    const result = await verifyEnvironmentStateBusyWithExpectedProductSetVersion('339', '20.10.12');
    expect(result).toBe(false);
  });

  it('should return false if environment is not in a BUSY state', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=name=339')
      .reply(200, [{
        name: '339',
        productSet: '20.10.12',
        state: 'QUARANTINE',
      }]);

    const result = await verifyEnvironmentStateBusyWithExpectedProductSetVersion('339', '20.10.12');
    expect(result).toBe(false);
  });

  it('should not care about productSet retrieved from EMT, if productSet passed in is "pending"', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=name=339')
      .reply(200, [{
        name: '339',
        productSet: '20.10.27',
        state: 'BUSY',
      }]);

    const result = await verifyEnvironmentStateBusyWithExpectedProductSetVersion('339', 'pending');
    expect(result).toBe(true);
  });

  it('should ensure environment is BUSY even when product set passed in is "pending"', async () => {
    nock(emtUrl)
      .get('/api/deployments/search?q=name=339')
      .reply(200, [{
        name: '339',
        productSet: '20.10.27',
        state: 'IDLE',
      }]);

    const result = await verifyEnvironmentStateBusyWithExpectedProductSetVersion('339', 'pending');
    expect(result).toBe(false);
  });
});
