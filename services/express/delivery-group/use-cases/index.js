const compareVersions = require('compare-versions');
const { makeFindTestEnvironmentQueuedDeliveryGroups } = require('./find-test-environment-queued-delivery-groups');
const { makeDeliverDeliveryGroups } = require('./deliver-delivery-groups');
const { makeObsoleteDeliveryGroups } = require('./obsolete-delivery-groups');
const { makeCheckIfDeliveryGroupContainsBugOrTR } = require('./check-delivery-group-contains-bug-or-tr');
const { retrieveListOfExcludedTeamsNames } = require('../../delivery-queue-team-exclusions/use-cases');
const { makeFilterAllDeliveryGroupsFromExclusionTeamList } = require('./filter-all-delivery-groups-from-exclusion-team-list');
const { makeRetrieveValidDeliveryGroups } = require('./retrieve-valid-delivery-groups');
const { makeFilterDuplicateRpms } = require('./filter-duplicate-rpms');
const { makeFilterDuplicateTeams } = require('./filter-duplicate-team-name');
const { makeCheckIfDeliveryGroupContainsTestware } = require('./check-delivery-group-contains-testware');
const { makeCheckDgRpmVersionsHigherThanEnmBaselineVersions } = require('./check-dg-rpm-versions-higher-than-enm-baseline-versions');
const { makeDecideOnDgCategoryAndTestEnvironmentToPick } = require('./decide-on-dg-category-and-test-environment-to-pick');
const { retrieveBugsAndTRsOnlyStatus } = require('../../switchboard/use-cases');
const { useExternalApiService } = require('../../external-apis');

const checkIfDeliveryGroupContainsTestware = makeCheckIfDeliveryGroupContainsTestware();
const decideOnDgCategoryAndTestEnvironmentToPick = makeDecideOnDgCategoryAndTestEnvironmentToPick();
const checkDgRpmVersionsHigherThanEnmBaselineVersions = makeCheckDgRpmVersionsHigherThanEnmBaselineVersions(compareVersions);
const checkIfDeliveryGroupContainsBugOrTR = makeCheckIfDeliveryGroupContainsBugOrTR();
const filterDuplicateRpms = makeFilterDuplicateRpms(compareVersions);
const filterDuplicateTeams = makeFilterDuplicateTeams();
const filterAllDeliveryGroupsFromExclusionTeamList = makeFilterAllDeliveryGroupsFromExclusionTeamList();
const retrieveValidDeliveryGroups = makeRetrieveValidDeliveryGroups(checkIfDeliveryGroupContainsTestware, checkIfDeliveryGroupContainsBugOrTR,
  retrieveBugsAndTRsOnlyStatus, checkDgRpmVersionsHigherThanEnmBaselineVersions, useExternalApiService.useExternalApi,
  decideOnDgCategoryAndTestEnvironmentToPick, filterDuplicateRpms,
  retrieveListOfExcludedTeamsNames, filterAllDeliveryGroupsFromExclusionTeamList);
const findTestEnvironmentQueuedDeliveryGroups = makeFindTestEnvironmentQueuedDeliveryGroups(useExternalApiService, retrieveValidDeliveryGroups);
const deliverDeliveryGroups = makeDeliverDeliveryGroups(useExternalApiService);
const obsoleteDeliveryGroups = makeObsoleteDeliveryGroups(useExternalApiService);

const deliveryGroupService = Object.freeze({
  decideOnDgCategoryAndTestEnvironmentToPick,
  findTestEnvironmentQueuedDeliveryGroups,
  deliverDeliveryGroups,
  obsoleteDeliveryGroups,
  checkIfDeliveryGroupContainsBugOrTR,
  checkIfDeliveryGroupContainsTestware,
  filterAllDeliveryGroupsFromExclusionTeamList,
  retrieveValidDeliveryGroups,
  filterDuplicateRpms,
  filterDuplicateTeams,
  checkDgRpmVersionsHigherThanEnmBaselineVersions,
});

module.exports = {
  deliveryGroupService,
  decideOnDgCategoryAndTestEnvironmentToPick,
  findTestEnvironmentQueuedDeliveryGroups,
  deliverDeliveryGroups,
  obsoleteDeliveryGroups,
  checkIfDeliveryGroupContainsBugOrTR,
  checkIfDeliveryGroupContainsTestware,
  filterAllDeliveryGroupsFromExclusionTeamList,
  retrieveValidDeliveryGroups,
  filterDuplicateRpms,
  filterDuplicateTeams,
  checkDgRpmVersionsHigherThanEnmBaselineVersions,
};
