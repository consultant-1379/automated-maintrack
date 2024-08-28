const expect = require('expect');

const { makeDeliverDeliveryGroups } = require('../../use-cases/deliver-delivery-groups');

const VALID_DELIVERY_GROUP = [{
  createdByTeam: 'Starks',
  deliveryGroupId: '42430',
  includedCategories: 'service,testware',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    name: 'ERICstrike_CXP9034650',
    category: 'ms',
    version: '1.1.12',
  }],
}];

const VALID_DELIVERY_GROUPS = [{
  createdByTeam: 'Starks',
  deliveryGroupId: '42430',
  includedCategories: 'service,testware',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    name: 'ERICtrigger_CXP9030570',
    category: 'ms',
    version: '4.3.6',
  }],
},
{
  createdByTeam: 'Magrathea',
  deliveryGroupId: '42937',
  includedCategories: 'service',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    name: 'ERICazte_CXP9030890',
    category: 'service',
    version: '1.5.9',
  }],
},
{
  createdByTeam: 'Chanakya',
  deliveryGroupId: '42431',
  includedCategories: 'service,model',
  typeOfDelivery: 'auto',
  deliveredRpms: [{
    name: 'ERICvulcan_CXP9030570',
    category: 'service',
    version: '1.3.12',
  }],
},
];

const VALID_DELIVERED_DELIVERY_GROUP = [{
  deliveryGroupId: '42430',
  response: 'Delivery Group 42430 has been delivered',
  statusCode: 200,
}];

const VALID_DELIVERED_DELIVERY_GROUPS = [{
  deliveryGroupId: '42430',
  response: 'Delivery Group 42430 has been delivered',
  statusCode: 200,
}, {
  deliveryGroupId: '42937',
  response: 'Delivery Group 42937 has been delivered',
  statusCode: 200,
}, {
  deliveryGroupId: '42431',
  response: 'Delivery Group 42431 has been delivered',
  statusCode: 200,
}];

const INVALID_DELIVERED_DELIVERY_GROUP = [{
  deliveryGroupId: '42430',
  response: 'Error: Delivery Group 42430 has not been delivered',
  statusCode: 500,
}];

const INVALID_DELIVERED_DELIVERY_GROUPS = [{
  deliveryGroupId: '42430',
  response: 'Error: Delivery Group 42430 has not been delivered',
  statusCode: 500,
}, {
  deliveryGroupId: '42937',
  response: 'Error: Delivery Group 42937 has not been delivered',
  statusCode: 500,
}, {
  deliveryGroupId: '42431',
  response: 'Error: Delivery Group 42431 has not been delivered',
  statusCode: 500,
}];


describe('Unit Test: Deliver delivery groups use case', () => {
  it('should successfully return a valid delivered delivery group', async () => {
    const deliverDeliveryGroups = makeDeliverDeliveryGroups({
      useExternalApi: {
        deliverDeliveryGroup: deliveryGroupId => ({
          deliveryGroupId,
          statusCode: 200,
          body: {
            response: `Delivery Group ${deliveryGroupId} has been delivered`,
            successfulDelivery: true,
          },
        }),
      },
    });

    const deliveredDeliveryGroup = await deliverDeliveryGroups(VALID_DELIVERY_GROUP);
    expect(deliveredDeliveryGroup).toEqual(VALID_DELIVERED_DELIVERY_GROUP);
  });

  it('should successfully return valid delivered delivery groups', async () => {
    const deliverDeliveryGroups = makeDeliverDeliveryGroups({
      useExternalApi: {
        deliverDeliveryGroup: deliveryGroupId => ({
          deliveryGroupId,
          statusCode: 200,
          body: {
            response: `Delivery Group ${deliveryGroupId} has been delivered`,
            successfulDelivery: true,
          },
        }),
      },
    });

    const deliveredDeliveryGroups = await deliverDeliveryGroups(VALID_DELIVERY_GROUPS);
    expect(deliveredDeliveryGroups).toEqual(VALID_DELIVERED_DELIVERY_GROUPS);
  });

  it('should successfully return a valid undelivered delivery group', async () => {
    const deliverDeliveryGroups = makeDeliverDeliveryGroups({
      useExternalApi: {
        deliverDeliveryGroup: deliveryGroupId => ({
          deliveryGroupId,
          statusCode: 500,
          body: {
            response: `Error: Delivery Group ${deliveryGroupId} has not been delivered`,
            successfulDelivery: false,
          },
        }),
      },
    });

    const deliveredDeliveryGroup = await deliverDeliveryGroups(VALID_DELIVERY_GROUP);
    expect(deliveredDeliveryGroup).toEqual(INVALID_DELIVERED_DELIVERY_GROUP);
  });

  it('should successfully return valid undelivered delivery groups', async () => {
    const deliverDeliveryGroups = makeDeliverDeliveryGroups({
      useExternalApi: {
        deliverDeliveryGroup: deliveryGroupId => ({
          deliveryGroupId,
          statusCode: 500,
          body: {
            response: `Error: Delivery Group ${deliveryGroupId} has not been delivered`,
            successfulDelivery: false,
          },
        }),
      },
    });

    const deliveredDeliveryGroups = await deliverDeliveryGroups(VALID_DELIVERY_GROUPS);
    expect(deliveredDeliveryGroups).toEqual(INVALID_DELIVERED_DELIVERY_GROUPS);
  });
});
