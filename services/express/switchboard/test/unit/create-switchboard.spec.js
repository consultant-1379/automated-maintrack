const expect = require('expect');

const { makeCreateSwitchboard } = require('../../use-cases/create-switchboard');
const { makeFakeSwitchboard } = require('../../../__test__/fixtures/switchboard');
const { createSwitchboard } = require('../../entities');

describe('Unit Test: Create switchboard use case', () => {
  it('mocks the insertion of a switchboard in the database', async () => {
    const newSwitchboard = {
      amtTriggerStatus: 'off',
      e2eSlotCompletionDGObsoletionBehaviour: 'off',
      bugsAndTRsOnlyStatus: 'off',
      slotUgFailureBehaviour: 'obsolete',
      upgradeSlotMechanismStatus: 'sequential',
      numberOfDeliveryGroups: 2,
      lastModifiedBySignum: 'eaaaaa',
    };
    const createSwitchboards = makeCreateSwitchboard({
      insert: () => newSwitchboard,
      findAll: () => [],
    }, createSwitchboard, () => undefined, () => undefined);

    const insertedSwitchboard = await createSwitchboards();
    expect(insertedSwitchboard).toMatchObject(newSwitchboard);
  });

  it('must throw an error if a switchboard already exists in the db and user tries to create another', (done) => {
    const newSwitchboard = makeFakeSwitchboard();
    const createSwitchboards = makeCreateSwitchboard({
      findAll: () => [newSwitchboard],
    }, createSwitchboard);

    createSwitchboards(newSwitchboard).catch((error) => {
      expect(error.message).toBe('A switch already exists so not creating a new one');
    })
      .then(done, done);
  });
});
