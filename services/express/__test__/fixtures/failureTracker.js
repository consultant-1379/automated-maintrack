const faker = require('faker');
const cuid = require('cuid');

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

function makeFakeFailureTracker(overrides) {
  const validDeployPhaseOptions = ['install', 'upgrade'];
  const randomDeployPhaseOption = faker.random.arrayElement(validDeployPhaseOptions);
  const failureTracker = {
    id: Id.makeId(),
    deployPhase: randomDeployPhaseOption,
    reasonsForFailure: [],
    createdOn: Date.now(),
  };

  return {
    ...failureTracker,
    ...overrides,
  };
}

module.exports = { makeFakeFailureTracker };
