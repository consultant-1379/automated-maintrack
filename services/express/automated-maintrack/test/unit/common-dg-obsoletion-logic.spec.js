const expect = require('expect');

const { makeCommonDgObsoletionLogic } = require('../../use-cases/orchestrate-post-slot-actions-helper/slot-failure-helper/common-dg-obsoletion-logic');
const { makeFakeSlot } = require('./../../../__test__/fixtures/slot');

describe('Unit Test: Common delivery group obsoletion logic use case', () => {
  it('should make necessary slot updates when successfully obsoleted all dgs and e2eSlotCompletionDGObsoletionBehaviour set to all', async () => {
    let sendAllDeliveryGroupsObsoletedSuccessMailCalled = false;
    const fakeSlot = makeFakeSlot();

    const sendEmailServiceMock = {
      sendAllDeliveryGroupsObsoletedSuccessMail: () => {
        sendAllDeliveryGroupsObsoletedSuccessMailCalled = true;
      },
      sendPredictedDeliveryGroupsObsoletedMail: () => null,
      sendDeliveryGroupsObsoletionFailureMail: () => null,
    };

    const deliveryGroupServiceMock = {
      obsoleteDeliveryGroups: () => ({
        obsoletedDeliveryGroups: [fakeSlot.deliveredDGs],
        deliveryGroupsFailedToObsolete: [],
      }),
    };

    const slotServiceMock = {
      updateSlot: () => {
        fakeSlot.obsoletedDGs = fakeSlot.deliveredDGs;
        return fakeSlot;
      },
    };

    const switchboardServiceMock = {
      modifySwitchboard: () => null,
    };

    const commonDgObsoletionLogic = makeCommonDgObsoletionLogic(sendEmailServiceMock,
      deliveryGroupServiceMock, slotServiceMock, switchboardServiceMock);
    const slotAfterCommonDgObsoletionLogic = await commonDgObsoletionLogic(fakeSlot, fakeSlot.deliveredDGs, [], 'all', 'on', 'on');
    expect(slotAfterCommonDgObsoletionLogic.deliveredDGs).toEqual(slotAfterCommonDgObsoletionLogic.obsoletedDGs);
    expect(sendAllDeliveryGroupsObsoletedSuccessMailCalled).toBeTruthy();
  });

  it('should make necessary slot updates when successfully obsoleted all dgs and e2eSlotCompletionDGObsoletionBehaviour set to predictions', async () => {
    let sendPredictedDeliveryGroupsObsoletedMailCalled = false;
    const fakeSlot = makeFakeSlot();

    const sendEmailServiceMock = {
      sendAllDeliveryGroupsObsoletedSuccessMail: () => null,
      sendPredictedDeliveryGroupsObsoletedMail: () => {
        sendPredictedDeliveryGroupsObsoletedMailCalled = true;
      },
      sendDeliveryGroupsObsoletionFailureMail: () => null,
    };

    const deliveryGroupServiceMock = {
      obsoleteDeliveryGroups: () => ({
        obsoletedDeliveryGroups: [fakeSlot.deliveredDGs],
        deliveryGroupsFailedToObsolete: [],
      }),
    };

    const slotServiceMock = {
      updateSlot: () => {
        fakeSlot.obsoletedDGs = fakeSlot.deliveredDGs;
        return fakeSlot;
      },
    };

    const switchboardServiceMock = {
      modifySwitchboard: () => null,
    };

    const commonDgObsoletionLogic = makeCommonDgObsoletionLogic(sendEmailServiceMock,
      deliveryGroupServiceMock, slotServiceMock, switchboardServiceMock);
    const slotAfterCommonDgObsoletionLogic = await commonDgObsoletionLogic(fakeSlot, fakeSlot.deliveredDGs, [], 'predictions', 'on', 'on');
    expect(slotAfterCommonDgObsoletionLogic.deliveredDGs).toEqual(slotAfterCommonDgObsoletionLogic.obsoletedDGs);
    expect(sendPredictedDeliveryGroupsObsoletedMailCalled).toBeTruthy();
  });

  it('should make necessary slot updates when failed to obsolete all dgs', async () => {
    let sendDeliveryGroupsObsoletionFailureMailCalled = false;
    let modifySwitchboardCalled = false;
    const fakeSlot = makeFakeSlot();

    const sendEmailServiceMock = {
      sendAllDeliveryGroupsObsoletedSuccessMail: () => null,
      sendPredictedDeliveryGroupsObsoletedMail: () => null,
      sendDeliveryGroupsObsoletionFailureMail: () => {
        sendDeliveryGroupsObsoletionFailureMailCalled = true;
      },
    };

    const deliveryGroupServiceMock = {
      obsoleteDeliveryGroups: () => ({
        obsoletedDeliveryGroups: [],
        deliveryGroupsFailedToObsolete: [fakeSlot.deliveredDGs],
      }),
    };

    const slotServiceMock = {
      updateSlot: () => null,
    };

    const switchboardServiceMock = {
      modifySwitchboard: () => {
        modifySwitchboardCalled = true;
      },
    };

    const commonDgObsoletionLogic = makeCommonDgObsoletionLogic(sendEmailServiceMock, deliveryGroupServiceMock,
      slotServiceMock, switchboardServiceMock);

    await commonDgObsoletionLogic(fakeSlot, fakeSlot.deliveredDGs, [], 'on', 'on', 'on');
    expect(sendDeliveryGroupsObsoletionFailureMailCalled).toBeTruthy();
    expect(modifySwitchboardCalled).toBeTruthy();
  });

  it('should make necessary slot updates when failed to obsolete some dgs but successfully obsoleted others', async () => {
    let modifySwitchboardCalled = false;
    let sendDeliveryGroupsObsoletionFailureMailCalled = false;
    let sendAllDeliveryGroupsObsoletedSuccessMailCalled = false;
    const fakeSlot = makeFakeSlot({
      deliveredDGs: [{
        createdByTeam: 'Trigger',
        deliveryGroupId: '44183',
        includedCategories: 'ms',
        typeOfDelivery: 'auto',
        deliveredRpms: [{
          name: 'ERICtrigger_CXP9030570',
          category: 'ms',
          version: '4.3.6',
        }],
      },
      {
        createdByTeam: 'Aztec',
        deliveryGroupId: '44195',
        includedCategories: 'service,model,testware',
        typeOfDelivery: 'auto',
        deliveredRpms: [{
          name: 'ERICazte_CXP9030890',
          category: 'service',
          version: '1.5.9',
        }],
      }],
    });

    const dgToSuccessfullyObsolete = fakeSlot.deliveredDGs[0];
    const dgToFailToObsolete = fakeSlot.deliveredDGs[1];

    const sendEmailServiceMock = {
      sendAllDeliveryGroupsObsoletedSuccessMail: () => {
        sendAllDeliveryGroupsObsoletedSuccessMailCalled = true;
      },
      sendPredictedDeliveryGroupsObsoletedMail: () => null,
      sendDeliveryGroupsObsoletionFailureMail: () => {
        sendDeliveryGroupsObsoletionFailureMailCalled = true;
      },
    };

    const deliveryGroupServiceMock = {
      obsoleteDeliveryGroups: () => ({
        obsoletedDeliveryGroups: [dgToSuccessfullyObsolete],
        deliveryGroupsFailedToObsolete: [dgToFailToObsolete],
      }),
    };

    const slotServiceMock = {
      updateSlot: () => {
        fakeSlot.obsoletedDGs = dgToSuccessfullyObsolete;
        return fakeSlot;
      },
    };

    const switchboardServiceMock = {
      modifySwitchboard: () => {
        modifySwitchboardCalled = true;
      },
    };

    const commonDgObsoletionLogic = makeCommonDgObsoletionLogic(sendEmailServiceMock, deliveryGroupServiceMock,
      slotServiceMock, switchboardServiceMock);

    const slotAfterCommonDgObsoletionLogic = await commonDgObsoletionLogic(fakeSlot, fakeSlot.deliveredDGs, [], 'all', 'on', 'on');
    expect(slotAfterCommonDgObsoletionLogic.obsoletedDGs).toEqual(dgToSuccessfullyObsolete);
    expect(modifySwitchboardCalled).toBeTruthy();
    expect(sendDeliveryGroupsObsoletionFailureMailCalled).toBeTruthy();
    expect(sendAllDeliveryGroupsObsoletedSuccessMailCalled).toBeTruthy();
  });
});
