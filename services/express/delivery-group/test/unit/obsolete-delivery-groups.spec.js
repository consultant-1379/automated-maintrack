const expect = require('expect');

const { makeObsoleteDeliveryGroups } = require('../../use-cases/obsolete-delivery-groups');

const VALID_DROP = '20.06';

const VALID_DELIVERY_GROUPS = [{
  deliveryGroupId: '1234',
},
{
  deliveryGroupId: '4321',
}];

describe('Unit Test: Obsolete delivery groups use case', () => {
  it('must obsolete the correct delivery groups successfully', async () => {
    const obsoleteDeliveryGroups = makeObsoleteDeliveryGroups({
      useExternalApi: {
        obsoleteDeliveryGroup: (drop, deliveryGroupId) => ({
          deliveryGroupId,
          statusCode: 200,
          body: {
            response: `Delivery Group ${deliveryGroupId} has been obsoleted`,
          },
        }),
      },
    });
    const obsoletedDeliveryGroups = await obsoleteDeliveryGroups(VALID_DROP, VALID_DELIVERY_GROUPS);
    expect(obsoletedDeliveryGroups).toEqual({
      obsoletedDeliveryGroups: VALID_DELIVERY_GROUPS,
      deliveryGroupsFailedToObsolete: [],
    });
  });
  it('must return delivery groups that failed to obsolete', async () => {
    const obsoleteDeliveryGroups = makeObsoleteDeliveryGroups({
      useExternalApi: {
        obsoleteDeliveryGroup: (drop, deliveryGroupId) => ({
          deliveryGroupId,
          statusCode: 500,
          body: {
            response: `Delivery Group ${deliveryGroupId} failed to obsolete!`,
          },
        }),
      },
    });
    const obsoletedDeliveryGroups = await obsoleteDeliveryGroups(VALID_DROP, VALID_DELIVERY_GROUPS);
    expect(obsoletedDeliveryGroups).toEqual({
      obsoletedDeliveryGroups: [],
      deliveryGroupsFailedToObsolete: VALID_DELIVERY_GROUPS,
    });
  });
  it('must throw error if no drop provided', (done) => {
    const obsoleteDeliveryGroups = makeObsoleteDeliveryGroups({
      useExternalApi: {
        obsoleteDeliveryGroup: () => null,
      },
    });
    obsoleteDeliveryGroups(null, VALID_DELIVERY_GROUPS).catch((error) => {
      expect(error.message).toBe('To obsolete delivery groups, you must provide a drop and delivery groups.');
    }).then(done, done);
  });
  it('must throw error if no delivery groups provided', (done) => {
    const obsoleteDeliveryGroups = makeObsoleteDeliveryGroups({
      useExternalApi: {
        obsoleteDeliveryGroup: () => null,
      },
    });
    obsoleteDeliveryGroups(VALID_DROP, []).catch((error) => {
      expect(error.message).toBe('To obsolete delivery groups, you must provide a drop and delivery groups.');
    }).then(done, done);
  });
  it('must throw error if invalid delivery groups provided', (done) => {
    const obsoleteDeliveryGroups = makeObsoleteDeliveryGroups({
      useExternalApi: {
        obsoleteDeliveryGroup: () => null,
      },
    });
    obsoleteDeliveryGroups(VALID_DROP, null).catch((error) => {
      expect(error.message).toBe('To obsolete delivery groups, you must provide a drop and delivery groups.');
    }).then(done, done);
  });
});
