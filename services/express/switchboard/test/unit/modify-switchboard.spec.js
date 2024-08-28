const expect = require('expect');

const { makeUpdateSwitchboard } = require('../../use-cases/modify-switchboard');
const { makeFakeSwitchboard } = require('../../../__test__/fixtures/switchboard');
const { createSwitchboard } = require('../../entities');

describe('Unit Test: Modify switchboard use case', () => {
  it('mocks the modification of a switchboard from the database', async () => {
    const newSwitchboard = makeFakeSwitchboard({ overallSwitchboardStatus: 'on' });
    const updateSwitchboard = makeUpdateSwitchboard({
      findAll: () => [newSwitchboard],
      update: () => newSwitchboard,
    }, createSwitchboard, {
      listTimePeriod: () => [],
      removeTimePeriod: () => [],
      createNewTimePeriod: () => [],
    });

    const updatedSwitchboard = await updateSwitchboard({
      id: newSwitchboard.id,
    });

    expect(updatedSwitchboard.id).toEqual(newSwitchboard.id);
  });

  it('should not get a switchboard to modify if none exist', (done) => {
    const newSwitchboard = makeFakeSwitchboard();
    const updatedSwitchboard = makeUpdateSwitchboard({
      findAll: () => undefined,
    }, createSwitchboard, {
      listTimePeriod: () => [],
      removeTimePeriod: () => [],
      createNewTimePeriod: () => [],
    });

    updatedSwitchboard(newSwitchboard)
      .catch((error) => {
        expect(error).toEqual(new Error('No existing switchboard found'));
      })
      .then(done, done);
  });

  it('should return the existing switchboard from the db if there has been no changes made to the switchboard', async () => {
    const newSwitchboard = makeFakeSwitchboard();
    const updatedSwitchboard = makeUpdateSwitchboard({
      findAll: () => [newSwitchboard],
      update: () => undefined,
    }, createSwitchboard, {
      listTimePeriod: () => [],
      removeTimePeriod: () => [],
      createNewTimePeriod: () => [],
    });
    const potentialUpdateSwitchboard = await updatedSwitchboard(newSwitchboard);
    expect(potentialUpdateSwitchboard).toStrictEqual([newSwitchboard]);
  });

  it('should only return modifications to the original switchboard when actual changes are passed', async () => {
    const newSwitchboard = makeFakeSwitchboard({ amtTriggerStatus: 'off' });
    const newSwitchboardToBeChanged = createSwitchboard({ ...newSwitchboard, amtTriggerStatus: 'on' });

    const changedSwitchboard = {
      id: newSwitchboardToBeChanged.getId(),
      modifiedOn: newSwitchboardToBeChanged.getModifiedOn(),
      amtTriggerStatus: newSwitchboardToBeChanged.getAmtTriggerStatus(),
      numberOfDeliveryGroups: newSwitchboardToBeChanged.getNumberOfDeliveryGroups(),
      upgradeSlotMechanismStatus: newSwitchboardToBeChanged.getUpgradeSlotMechanismStatus(),
      lastModifiedBySignum: newSwitchboardToBeChanged.getLastModifiedBySignum(),
    };

    const updateSwitchboard = makeUpdateSwitchboard({
      findAll: () => [newSwitchboard],
      update: () => changedSwitchboard,
    }, createSwitchboard, {
      listTimePeriod: () => [],
      removeTimePeriod: () => [],
      createNewTimePeriod: () => [],
    });

    const updatedSwitchBoard = await updateSwitchboard(changedSwitchboard);

    expect(newSwitchboard.id).toEqual(updatedSwitchBoard.id);
    expect(newSwitchboard.amtTriggerStatus).not.toEqual(updatedSwitchBoard.amtTriggerStatus);
  });

  it('must update switchboard to enable e2eSlotCompletionDGObsoletionBehaviour', async () => {
    const newSwitchboard = makeFakeSwitchboard();
    const switchboardChanges = { e2eSlotCompletionDGObsoletionBehaviour: 'all' };
    const dbUpdatedSwitchboard = makeFakeSwitchboard(switchboardChanges);
    const updateSwitchboards = makeUpdateSwitchboard({
      findAll: () => [newSwitchboard],
      update: () => dbUpdatedSwitchboard,
    }, createSwitchboard, {
      listTimePeriod: () => [],
      removeTimePeriod: () => [],
      createNewTimePeriod: () => [],
    });
    const updatedSwitchboard = await updateSwitchboards(switchboardChanges);
    expect(updatedSwitchboard.e2eSlotCompletionDGObsoletionBehaviour).toBe('all');
  });

  it('must update switchboard to toggle upgradeSlotMechanismStatus', async () => {
    const newSwitchboard = makeFakeSwitchboard();
    const switchboardChanges = { upgradeSlotMechanismStatus: 'sequential' };
    const dbUpdatedSwitchboard = makeFakeSwitchboard(switchboardChanges);
    const updateSwitchboards = makeUpdateSwitchboard({
      findAll: () => [newSwitchboard],
      update: () => dbUpdatedSwitchboard,
    }, createSwitchboard, {
      listTimePeriod: () => [],
      removeTimePeriod: () => [],
      createNewTimePeriod: () => [],
    });
    const updatedSwitchboard = await updateSwitchboards(switchboardChanges);
    expect(updatedSwitchboard.upgradeSlotMechanismStatus).toBe('sequential');
  });
});
