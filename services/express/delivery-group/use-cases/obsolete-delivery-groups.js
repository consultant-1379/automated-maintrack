function makeObsoleteDeliveryGroups(useExternalApiService) {
  return async function obsoleteDeliveryGroups(drop, deliveryGroups) {
    const obsoletedDeliveryGroups = [];
    const deliveryGroupsFailedToObsolete = [];
    if (!drop || !deliveryGroups || deliveryGroups.length <= 0) {
      throw new Error('To obsolete delivery groups, you must provide a drop and delivery groups.');
    }
    for (const deliveryGroup of deliveryGroups) {
      const obsoletedDeliveryGroupResponse = await useExternalApiService.useExternalApi
        .obsoleteDeliveryGroup(drop, deliveryGroup.deliveryGroupId);
      if (obsoletedDeliveryGroupResponse.statusCode === 200) {
        obsoletedDeliveryGroups.push(deliveryGroup);
      } else {
        deliveryGroupsFailedToObsolete.push(deliveryGroup);
      }
    }
    return { obsoletedDeliveryGroups, deliveryGroupsFailedToObsolete };
  };
}

module.exports = { makeObsoleteDeliveryGroups };
