const expect = require('expect');

const { makeFakeSwitchboard } = require('../../../__test__/fixtures/switchboard');
const { createSwitchboard } = require('../../entities');

describe('Unit Test: Switchboard entity', () => {
  it('must be able to successfully create a switchboard', () => {
    const fakeSwitchboard = makeFakeSwitchboard();
    expect(() => createSwitchboard(fakeSwitchboard)).toBeTruthy();
  });

  it('must have a valid id', () => {
    const fakeSwitchboard = makeFakeSwitchboard({ id: 'invalid' });
    expect(() => createSwitchboard(fakeSwitchboard)).toThrow('Switchboard must have a valid id.');
    const invalidSwitchboard = makeFakeSwitchboard({ id: undefined });
    expect(() => createSwitchboard(invalidSwitchboard)).not.toThrow();
  });

  it('must not allow an invalid switchboard amtTriggerStatus', () => {
    const fakeSwitchboard = makeFakeSwitchboard({ amtTriggerStatus: 'invalid' });
    expect(() => createSwitchboard(fakeSwitchboard)).toThrow('You must use either on or off for the amtTriggerStatus value');
  });

  it('must not allow an invalid switchboard e2eSlotCompletionDGObsoletionBehaviour', () => {
    const fakeSwitchboard = makeFakeSwitchboard({ e2eSlotCompletionDGObsoletionBehaviour: 'invalid' });
    expect(() => createSwitchboard(fakeSwitchboard)).toThrow('You must use either all, predictions or off for the e2eSlotCompletionDGObsoletionBehaviour value');
  });

  it('must not allow an invalid switchboard bugsAndTRsOnlyStatus', () => {
    const fakeSwitchboard = makeFakeSwitchboard({ bugsAndTRsOnlyStatus: 'invalid' });
    expect(() => createSwitchboard(fakeSwitchboard)).toThrow('You must use either on or off for the bugsAndTRsOnlyStatus value');
  });

  it('must not allow an invalid switchboard slotUgFailureBehaviour', () => {
    const fakeSwitchboard = makeFakeSwitchboard({ slotUgFailureBehaviour: 'invalid' });
    expect(() => createSwitchboard(fakeSwitchboard)).toThrow('You must use either shutdown or obsolete for the slotUgFailureBehaviour value');
  });

  it('must not allow an invalid switchboard upgradeSlotMechanismStatus', () => {
    const fakeSwitchboard = makeFakeSwitchboard({ upgradeSlotMechanismStatus: 'invalid' });
    expect(() => createSwitchboard(fakeSwitchboard)).toThrow('You must use either parallel or sequential for the upgradeSlotMechanismStatus value');
  });

  it('check signum value is set properly at excluded team entity creation ', () => {
    const fakeSwitchboard = makeFakeSwitchboard({ signum: 'eaaaaa' });
    const lastModifiedBySignum = createSwitchboard(fakeSwitchboard).getLastModifiedBySignum();
    expect(lastModifiedBySignum).toStrictEqual('eaaaaa');
  });

  it('must not allow an invalid numberOfDeliveryGroups', () => {
    const fakeSwitchboard = makeFakeSwitchboard({ numberOfDeliveryGroups: 'invalid' });
    expect(() => createSwitchboard(fakeSwitchboard)).toThrow('You must enter a number between 1-4 for the numberOfDeliveryGroups value');
    let invalidSwitchboard = makeFakeSwitchboard({ numberOfDeliveryGroups: -1 });
    expect(() => createSwitchboard(invalidSwitchboard)).toThrow('You must enter a number between 1-4 for the numberOfDeliveryGroups value');
    invalidSwitchboard = makeFakeSwitchboard({ numberOfDeliveryGroups: null });
    expect(() => createSwitchboard(invalidSwitchboard)).toThrow('You must enter a number between 1-4 for the numberOfDeliveryGroups value');
    invalidSwitchboard = makeFakeSwitchboard({ numberOfDeliveryGroups: undefined });
    expect(() => createSwitchboard(invalidSwitchboard)).toThrow('You must enter a number between 1-4 for the numberOfDeliveryGroups value');
    invalidSwitchboard = makeFakeSwitchboard({ numberOfDeliveryGroups: '1' });
    expect(() => createSwitchboard(invalidSwitchboard)).toThrow('You must enter a number between 1-4 for the numberOfDeliveryGroups value');
  });
});
