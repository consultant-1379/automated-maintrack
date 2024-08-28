function makeFilterDuplicateTeams() {
  function filterTeams(allDeliveryGroups) {
    const teamNamesFilter = [];
    const filteredTeams = [];
    for (const deliveryGroup of allDeliveryGroups) {
      if (!teamNamesFilter[deliveryGroup.createdByTeam]) {
        teamNamesFilter[deliveryGroup.createdByTeam] = true;
        filteredTeams.push(deliveryGroup);
      }
    }
    return filteredTeams;
  }
  return function filterDuplicateTeams(allDeliveryGroups) {
    const filteredTeamDeliveryGroups = filterTeams(allDeliveryGroups);
    return filteredTeamDeliveryGroups;
  };
}

module.exports = { makeFilterDuplicateTeams };
