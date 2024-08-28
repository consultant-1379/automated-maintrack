const expect = require('expect');

const { makeRetrieveUpgradeSlotMechanismStatus } = require('../../use-cases/retrieve-upgrade-slot-mechanism-status');
const { makeFakeSwitchboard } = require('../../../__test__/fixtures/switchboard');

describe('Unit Test: Retrieve upgrade slot mechanism status use case', () => {
  it('should get the correct upgrade slot mechanism switch status', () => {
    const newSwitchboard = makeFakeSwitchboard({ upgradeSlotMechanismStatus: 'sequential' });
    const retrieveUpgradeSlotMechanismStatus = makeRetrieveUpgradeSlotMechanismStatus(
      () => [newSwitchboard],
    );
    const upgradeslotMechanismStatus = retrieveUpgradeSlotMechanismStatus();
    expect(upgradeslotMechanismStatus).toEqual('sequential');
  });
  it('should fail if no switchboard detected', () => {
    const retrieveUpgradeSlotMechanismStatus = makeRetrieveUpgradeSlotMechanismStatus(
      () => [],
    );
    expect(() => retrieveUpgradeSlotMechanismStatus())
      .toThrow('No switchboard detected. Please investigate.');
  });
  it('should fail if no upgrade slot mechanism switch status retrieved', () => {
    const invalidSwitchboard = {
      getUpgradeSlotMechanismStatus: () => null,
    };
    const retrieveUpgradeSlotMechanismStatus = makeRetrieveUpgradeSlotMechanismStatus(
      () => [invalidSwitchboard],
    );
    expect(() => retrieveUpgradeSlotMechanismStatus())
      .toThrow('Failed to retrieve upgradeSlotMechanismStatus.');
  });
});
