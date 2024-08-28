const expect = require('expect');

const { makeRetrieveSlotUgFailureBehaviour } = require('../../use-cases/retrieve-slot-ug-failure-behaviour');
const { makeFakeSwitchboard } = require('../../../__test__/fixtures/switchboard');

describe('Unit Test: Retrieve slot ug failure behaviour', () => {
  it('should get the correct slot ug failure behaviour', async () => {
    const validSlotUgFailureBehaviour = 'shutdown';
    const newSwitchboard = makeFakeSwitchboard({
      slotUgFailureBehaviour: validSlotUgFailureBehaviour,
    });
    const retrieveSlotUgFailureBehaviour = makeRetrieveSlotUgFailureBehaviour(
      () => [newSwitchboard],
    );
    const slotUgFailureBehaviour = await retrieveSlotUgFailureBehaviour();
    expect(slotUgFailureBehaviour).toEqual('shutdown');
  });
  it('should fail if no switchboard detected', async () => {
    const retrieveSlotUgFailureBehaviour = makeRetrieveSlotUgFailureBehaviour(
      () => [],
    );
    await retrieveSlotUgFailureBehaviour()
      .catch((error) => {
        expect(error).toEqual(new Error('No switchboard detected. Please investigate.'));
      });
  });
  it('should fail if no slot ug failure behaviour retrieved', async () => {
    const badSwitchboard = {
      getSlotUgFailureBehaviour: () => null,
    };
    const retrieveSlotUgFailureBehaviour = makeRetrieveSlotUgFailureBehaviour(
      () => [badSwitchboard],
    );
    await retrieveSlotUgFailureBehaviour()
      .catch((error) => {
        expect(error).toEqual(new Error('Failed to retrieve slotUgFailureBehaviour.'));
      });
  });
});
