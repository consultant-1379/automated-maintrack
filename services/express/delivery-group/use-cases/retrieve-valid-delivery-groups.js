const logger = require('./../../logger/logger');

function makeRetrieveValidDeliveryGroups(checkIfDeliveryGroupContainsTestware, checkIfDeliveryGroupContainsBugOrTR,
  retrieveBugsAndTRsOnlyStatus, checkDgRpmVersionsHigherThanEnmBaselineVersions, useExternalApi,
  decideOnDgCategoryAndTestEnvironmentToPick, filterDuplicateRpms,
  retrieveListOfExcludedTeamsNames, filterAllDeliveryGroupsFromExclusionTeamList) {
  function doAllDeliveryGroupsContainTestware(validDeliveryGroups, numberOfTestwareDeliveryGroups) {
    if (validDeliveryGroups.length === numberOfTestwareDeliveryGroups.amount) {
      return true;
    }
    logger.info('DeliveryGroup did not get selected as it does not contain Testware');
  }

  function isDGValidFromNonTestwareContentPerspective(queuedDeliveryGroup, validDeliveryGroups,
    doesDeliveryGroupContainTestware) {
    if (queuedDeliveryGroup.missingDependencies === 'False' && !doesDeliveryGroupContainTestware) {
      for (const deliveryGroup of validDeliveryGroups) {
        if (deliveryGroup.createdByTeam === queuedDeliveryGroup.createdByTeam) {
          logger.info('DeliveryGroup did not get selected as it is not valid from Nontestware Content Perspective');
          return false;
        }
      }
      validDeliveryGroups.push(queuedDeliveryGroup);
      return true;
    }
    return false;
  }

  function isDGValidFromTestwareContentPerspective(queuedDeliveryGroup, validDeliveryGroups,
    numberOfTestwareDeliveryGroups, doesDeliveryGroupContainTestware) {
    if (queuedDeliveryGroup.missingDependencies === 'False' && doesDeliveryGroupContainTestware && queuedDeliveryGroup.ccbApproved === 'False') {
      for (const artifact of queuedDeliveryGroup.artifacts) {
        if (artifact.artifact === 'ERICTAFtorhatestautomation_CXP9030905' || artifact.artifact === 'ERICTWassertionpythonutils_CXP9034853') {
          for (const deliveryGroup of validDeliveryGroups) {
            if (deliveryGroup.createdByTeam === queuedDeliveryGroup.createdByTeam) {
              logger.info('DeliveryGroup did not get selected as it is not valid from Testware Content Perspective');
              return false;
            }
          }
          validDeliveryGroups.push(queuedDeliveryGroup);
          numberOfTestwareDeliveryGroups.amount += 1;
          return true;
        }
      }
    }
    if (queuedDeliveryGroup.missingDependencies === 'False' && doesDeliveryGroupContainTestware && queuedDeliveryGroup.ccbApproved === 'True') {
      for (const deliveryGroup of validDeliveryGroups) {
        if (deliveryGroup.createdByTeam === queuedDeliveryGroup.createdByTeam) {
          logger.info('DeliveryGroup did not get selected as it is not valid from Testware Content Perspective');
          return false;
        }
      }
      validDeliveryGroups.push(queuedDeliveryGroup);
      numberOfTestwareDeliveryGroups.amount += 1;
      return true;
    }
    return false;
  }

  function moveAutOrEvtDgsToStartOfArray(allDeliveryGroups, clusterType) {
    for (const queuedDeliveryGroup of allDeliveryGroups) {
      for (const artifact of queuedDeliveryGroup.artifacts) {
        if (artifact.category.includes(clusterType)) {
          allDeliveryGroups.sort((firstElement, secondElement) => {
            if (firstElement === queuedDeliveryGroup) {
              return -1;
            }
            if (secondElement === queuedDeliveryGroup) {
              return 1;
            }
            return 0;
          });
        }
      }
    }
    return allDeliveryGroups;
  }

  return async function retrieveValidDeliveryGroups(allDeliveryGroups, numberOfDeliveryGroupsNeeded, testEnvironments) {
    let validNonTestwareDeliveryGroupFound = false;
    let validTestwareDeliveryGroupFound = false;
    let doesDeliveryGroupContainTestware = false;
    let doesDeliveryGroupContainBugOrTR = false;
    const bugsAndTRsOnlyStatus = await retrieveBugsAndTRsOnlyStatus();
    const validDeliveryGroups = [];
    const numberOfTestwareDeliveryGroups = { amount: 0 };
    const testEnvironment = decideOnDgCategoryAndTestEnvironmentToPick(allDeliveryGroups, testEnvironments);
    const listOfExcludedTeamName = await retrieveListOfExcludedTeamsNames();
    allDeliveryGroups = filterDuplicateRpms(allDeliveryGroups);
    allDeliveryGroups = filterAllDeliveryGroupsFromExclusionTeamList(allDeliveryGroups, listOfExcludedTeamName);
    allDeliveryGroups = moveAutOrEvtDgsToStartOfArray(allDeliveryGroups, testEnvironment.clusterType);
    const latestDrop = await useExternalApi.getLatestDrop();
    const latestEnmIsoVersion = await useExternalApi.getLatestEnmIsoVersion(latestDrop);
    const enmPackages = await useExternalApi.getPackagesInEnmIso(latestEnmIsoVersion);
    const enmTestwarePackages = await useExternalApi.getPackagesInEnmTestwareIso(latestEnmIsoVersion);
    for (const queuedDeliveryGroup of allDeliveryGroups) {
      doesDeliveryGroupContainBugOrTR = checkIfDeliveryGroupContainsBugOrTR(queuedDeliveryGroup);
      if (bugsAndTRsOnlyStatus === 'off' || doesDeliveryGroupContainBugOrTR) {
        doesDeliveryGroupContainTestware = checkIfDeliveryGroupContainsTestware(queuedDeliveryGroup);
        if (await checkDgRpmVersionsHigherThanEnmBaselineVersions(queuedDeliveryGroup,
          enmPackages, enmTestwarePackages, doesDeliveryGroupContainTestware)) {
          validNonTestwareDeliveryGroupFound = isDGValidFromNonTestwareContentPerspective(
            queuedDeliveryGroup, validDeliveryGroups, doesDeliveryGroupContainTestware,
          );
          validTestwareDeliveryGroupFound = isDGValidFromTestwareContentPerspective(
            queuedDeliveryGroup, validDeliveryGroups, numberOfTestwareDeliveryGroups, doesDeliveryGroupContainTestware,
          );
          if ((validNonTestwareDeliveryGroupFound || validTestwareDeliveryGroupFound)
         && (validDeliveryGroups.length === numberOfDeliveryGroupsNeeded)) {
            if (!doAllDeliveryGroupsContainTestware(validDeliveryGroups, numberOfTestwareDeliveryGroups)) {
              return { validDeliveryGroups, testEnvironment };
            }
            validDeliveryGroups.splice(-1, 1);
            numberOfTestwareDeliveryGroups.amount -= 1;
          }
        }
      }
    }
    if (!doAllDeliveryGroupsContainTestware(validDeliveryGroups, numberOfTestwareDeliveryGroups)) {
      return { validDeliveryGroups, testEnvironment };
    }
    return { validDeliveryGroups: [], testEnvironment };
  };
}

module.exports = { makeRetrieveValidDeliveryGroups };
