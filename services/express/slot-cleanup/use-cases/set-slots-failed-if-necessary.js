async function determineEnvironmentStateBusyWithExpectedProductSetVersion(platformStatus, environmentName,
  productSetVersion, testEnvironmentService) {
  if (platformStatus === 'failure' || platformStatus === 'success' || environmentName === 'pending') {
    return false;
  }
  return testEnvironmentService.verifyEnvironmentStateBusyWithExpectedProductSetVersion(environmentName, productSetVersion);
}

function buildSetSlotsFailedIfNecessary(slotService, testEnvironmentService, sendEmailService) {
  return async function setSlotsFailedIfNecessary() {
    const ongoingSlots = await slotService.searchForSlots({ slotStatus: 'ongoing' });
    if (ongoingSlots.length === 0) {
      return 'No ongoing slots, no slot cleanup necessary';
    }

    let returnMessage = 'Slot data accurate and so no slot cleanup necessary';
    for (const ongoingSlot of ongoingSlots) {
      let isReadyForCleanup = 0;
      let requirediterations = 1;
      if (process.env.NODE_ENV === 'PROD' || process.env.NODE_ENV === 'STAG') {
        requirediterations = 3;
      }
      for (let i = 0; i < requirediterations; i += 1) {
        const doesPhysicalMeetOngoingRequirements = await determineEnvironmentStateBusyWithExpectedProductSetVersion(ongoingSlot.physicalStatus,
          ongoingSlot.physicalEnvironment, ongoingSlot.productSetVersion, testEnvironmentService);
        const doesCloudMeetOngoingRequirements = await determineEnvironmentStateBusyWithExpectedProductSetVersion(ongoingSlot.cloudStatus,
          ongoingSlot.cloudEnvironment, ongoingSlot.productSetVersion, testEnvironmentService);
        if (!doesPhysicalMeetOngoingRequirements && !doesCloudMeetOngoingRequirements) {
          isReadyForCleanup += 1;
        }
        if (process.env.NODE_ENV === 'PROD' || process.env.NODE_ENV === 'STAG') {
          await new Promise(resolve => setTimeout(() => resolve(), 90000));
        }
      }

      if (isReadyForCleanup === requirediterations) {
        await sendEmailService.sendAmtHasInaccurateSlotData(ongoingSlot);
        await slotService.updateSlot({
          id: ongoingSlot.id,
          slotStatus: 'failure',
        });
        returnMessage = 'Successfully updated inaccurate slot';
      }
    }
    return returnMessage;
  };
}

module.exports = { buildSetSlotsFailedIfNecessary };
