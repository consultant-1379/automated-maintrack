const faker = require('faker');
const cuid = require('cuid');

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

function makeFakeTimePeriod(overrides) {
  const validLengthOfTimePeriod = [
    '0:30',
    '2:45',
  ];

  const timePeriod = {
    id: Id.makeId(),
    lengthOfTimePeriod: faker.random.arrayElement(validLengthOfTimePeriod),
  };

  return {
    ...timePeriod,
    ...overrides,
  };
}

module.exports = { makeFakeTimePeriod };
