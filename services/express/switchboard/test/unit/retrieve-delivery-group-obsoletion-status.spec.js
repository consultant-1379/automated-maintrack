const expect = require('expect');

const { makeRetrieveE2eSlotCompletionDGObsoletionBehaviour } = require('../../use-cases/retrieve-delivery-group-obsoletion-status');
const { makeFakeSwitchboard } = require('../../../__test__/fixtures/switchboard');

describe('Unit Test: Retrieve delivery group obsoletion status use case', () => {
  it('should get the correct delivery group obsoletion switch status', async () => {
    const validE2eSlotCompletionDGObsoletionBehaviour = 'all';
    const newSwitchboard = makeFakeSwitchboard({
      e2eSlotCompletionDGObsoletionBehaviour: validE2eSlotCompletionDGObsoletionBehaviour,
    });
    const retrieveE2eSlotCompletionDGObsoletionBehaviour = makeRetrieveE2eSlotCompletionDGObsoletionBehaviour(
      () => [newSwitchboard],
    );
    const e2eSlotCompletionDGObsoletionBehaviour = await retrieveE2eSlotCompletionDGObsoletionBehaviour();
    expect(e2eSlotCompletionDGObsoletionBehaviour).toEqual('all');
  });
  it('should fail if no switchboard detected', async () => {
    const retrieveE2eSlotCompletionDGObsoletionBehaviour = makeRetrieveE2eSlotCompletionDGObsoletionBehaviour(
      () => [],
    );
    await retrieveE2eSlotCompletionDGObsoletionBehaviour()
      .catch((error) => {
        expect(error).toEqual(new Error('No switchboard detected. Please investigate.'));
      });
  });
  it('should fail if no delivery group obsoletion status retrieved', async () => {
    const badSwitchboard = {
      getE2eSlotCompletionDGObsoletionBehaviour: () => null,
    };
    const retrieveE2eSlotCompletionDGObsoletionBehaviour = makeRetrieveE2eSlotCompletionDGObsoletionBehaviour(
      () => [badSwitchboard],
    );
    await retrieveE2eSlotCompletionDGObsoletionBehaviour()
      .catch((error) => {
        expect(error).toEqual(new Error('Failed to retrieve e2eSlotCompletionDGObsoletionBehaviour.'));
      });
  });
});
