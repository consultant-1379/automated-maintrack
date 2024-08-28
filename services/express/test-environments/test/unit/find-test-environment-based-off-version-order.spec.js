require('../../../config/config');
const expect = require('expect');

const environmentsOne = [
  {
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
  },
];

const environmentsTwo = [
  {
    name: '297',
    productSet: '19.05.11',
  }, {
    name: '306',
    productSet: '19.04.10',
  }, {
    name: '339',
    productSet: '19.03.11',
  }, {
    name: '402',
    productSet: '19.05.11',
  },
];

const { findTestEnvironmentBasedOffVersionOrder } = require('../../use-cases');

describe('Unit Test: Find test environment based off version order use case', () => {
  it('must select latest environment', () => {
    const candidateEnvironment = findTestEnvironmentBasedOffVersionOrder(environmentsOne, 'latest');
    expect(candidateEnvironment).toBe('402');
  });
  it('must select oldest environment', () => {
    const candidateEnvironment = findTestEnvironmentBasedOffVersionOrder(environmentsOne, 'oldest');
    expect(candidateEnvironment).toBe('339');
  });
  it('must select 1 environment when 2 environments have the same product set version', () => {
    const candidateEnvironment = findTestEnvironmentBasedOffVersionOrder(environmentsTwo, 'latest');
    expect(['297', '402'].includes(candidateEnvironment)).toBe(true);
  });
});
