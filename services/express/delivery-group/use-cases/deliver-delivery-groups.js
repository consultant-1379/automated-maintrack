function makeDeliverDeliveryGroups(useExternalApiService) {
  return async function deliverDeliveryGroups(deliveryGroups) {
    const deliveredDeliveryGroups = [];
    for (const deliveryGroup of deliveryGroups) {
      const deliveredDeliveryGroupResponse = await useExternalApiService
        .useExternalApi.deliverDeliveryGroup(deliveryGroup.deliveryGroupId);
      deliveredDeliveryGroups.push({
        deliveryGroupId: deliveryGroup.deliveryGroupId,
        statusCode: deliveredDeliveryGroupResponse.statusCode,
        response: deliveredDeliveryGroupResponse.body.response,
      });
    }
    return deliveredDeliveryGroups;
  };
}
module.exports = { makeDeliverDeliveryGroups };
