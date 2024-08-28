const expect = require('expect');

const { makeRetrieveNumberOfDeliveryGroups } = require('../../use-cases/retrieve-number-of-delivery-groups');
const { makeFakeSwitchboard } = require('../../../__test__/fixtures/switchboard');

describe('Unit Test: Retrieve number of delivery groups use case', () => {
  it('should get the correct number of delivery groups', async () => {
    const newSwitchboard = makeFakeSwitchboard({ numberOfDeliveryGroups: 4 });
    const retrieveNumberOfDeliveryGroups = makeRetrieveNumberOfDeliveryGroups(
      () => [newSwitchboard],
    );
    const numberOfDeliveryGroups = await retrieveNumberOfDeliveryGroups();
    expect(numberOfDeliveryGroups).toEqual(4);
  });
  it('should fail if no switchboard detected', (done) => {
    const retrieveNumberOfDeliveryGroups = makeRetrieveNumberOfDeliveryGroups(
      () => [],
    );
    retrieveNumberOfDeliveryGroups().catch((error) => {
      expect(error.message).toBe('No switchboard detected. Please investigate.');
    })
      .then(done, done);
  });
  it('should fail if no number of delivery groups retrieved', (done) => {
    const invalidSwitchboard = {
      numberOfDeliveryGroups: null,
    };
    const retrieveNumberOfDeliveryGroups = makeRetrieveNumberOfDeliveryGroups(
      () => [invalidSwitchboard],
    );

    retrieveNumberOfDeliveryGroups().catch((error) => {
      expect(error.message).toBe('Failed to retrieve numberOfDeliveryGroups.');
    })
      .then(done, done);
  });
});
