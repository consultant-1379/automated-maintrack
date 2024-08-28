const logger = require('./../../logger/logger');

function makeFilterAllDeliveryGroupsFromExclusionTeamList() {
  function filterExcludedTeams(allDeliveryGroups, listOfExcludedTeamName) {
    let tempAllDeliveryGroups = allDeliveryGroups;
    for (const checkTeamName of listOfExcludedTeamName) {
      for (const deliveryGroup of allDeliveryGroups) {
        if (checkTeamName.teamName === deliveryGroup.createdByTeam) {
          tempAllDeliveryGroups = tempAllDeliveryGroups.filter(item => item.createdByTeam !== checkTeamName.teamName);
          logger.info('DeliveryGroup did not get selected as the team is in MTE Delivery Queue Team Exclusion List');
        }
      }
    }
    return tempAllDeliveryGroups;
  }

  return function filterAllDeliveryGroupsFromExclusionTeamList(allDeliveryGroups, listOfExcludedTeamName) {
    const tempAllDeliveryGroups = filterExcludedTeams(allDeliveryGroups, listOfExcludedTeamName);
    return tempAllDeliveryGroups;
  };
}

module.exports = { makeFilterAllDeliveryGroupsFromExclusionTeamList };
