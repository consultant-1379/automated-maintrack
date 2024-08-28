const expect = require('expect');

const { makeRemoveExcludedTeam } = require('../../use-cases/remove-excluded-team');
const { makeFakeExcludedTeam } = require('../../../__test__/fixtures/excludedTeams');

describe('Unit Test: Remove excluded team use case', () => {
  it('mocks the removing of a excluded team from the database', async () => {
    const newExcludedTeam = makeFakeExcludedTeam();
    const removeExcludedTeam = makeRemoveExcludedTeam({
      remove: () => 1,
    });

    const deletedCount = await removeExcludedTeam({
      id: newExcludedTeam.id,
    });

    expect(deletedCount).toBe(1);
  });
});
