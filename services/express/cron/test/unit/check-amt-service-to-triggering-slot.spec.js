const expect = require('expect');
const { buildCheckAmtServiceToTriggerSlot } = require('../../use-cases/check-amt-service-to-triggering-slot');
const { makeListSwitchboard } = require('../../../switchboard/use-cases/list-switchboard');

describe('Unit Test: Check AMT service to triggering slot use case', (done) => {
  it('must throw an error if the switchboard can not be found', () => {
    const listSwitchboard = makeListSwitchboard({
      findAll: () => [],
    });
    const checkAmtService = buildCheckAmtServiceToTriggerSlot(listSwitchboard, {});
    checkAmtService().catch((error) => {
      expect(error.message).toBe('Failed to retrieve switchboard.');
    })
      .then(done, done);
  });
  it('must throw an error if the switchboard does not have an amtTriggerStatus', () => {
    const listSwitchboard = makeListSwitchboard({
      findAll: () => [{
        id: '3445345ewret43534ret',
        e2eSlotCompletionDGObsoletionBehaviour: 'off',
        upgradeSlotMechanismStatus: 'sequential',
      }],
    });
    const checkAmtService = buildCheckAmtServiceToTriggerSlot(listSwitchboard, {});
    checkAmtService().catch((error) => {
      expect(error.message).toBe('There is no amtTriggerStatus in the switchboard.');
    })
      .then(done, done);
  });
  it('must throw an error if the switchboard does not have an upgradeSlotMechanismStatus', () => {
    const listSwitchboard = makeListSwitchboard({
      findAll: () => [{
        id: '3445345ewret43534ret',
        e2eSlotCompletionDGObsoletionBehaviour: 'off',
        amtTriggerStatus: 'off',
      }],
    });
    const checkAmtService = buildCheckAmtServiceToTriggerSlot(listSwitchboard, {});
    checkAmtService().catch((error) => {
      expect(error.message).toBe('There is no upgradeSlotMechanismStatus in the switchboard.');
    })
      .then(done, done);
  });
});
