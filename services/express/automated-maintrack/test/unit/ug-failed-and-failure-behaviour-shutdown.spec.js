const expect = require('expect');

const { makeUgFailedAndFailureBehaviourShutdown } = require('../../use-cases/orchestrate-post-slot-actions-helper/slot-failure-helper/ug-failed-and-failure-behaviour-shutdown');
const { makeFakeSlot } = require('./../../../__test__/fixtures/slot');

describe('Unit Test: Upgrade failed and upgrade failure behaviour is set to shutdown use case', () => {
  it('should call sendUpgradeFailureMail functions', async () => {
    let sendUpgradeFailureMail = false;

    const ugFailedAndFailureBehaviourShutdown = makeUgFailedAndFailureBehaviourShutdown(
      {
        sendUpgradeFailureMail: () => {
          sendUpgradeFailureMail = true;
        },
      }, {
        modifySwitchboard: () => null,
      },
    );
    const fakeSlot = makeFakeSlot();
    await ugFailedAndFailureBehaviourShutdown(fakeSlot);
    expect(sendUpgradeFailureMail).toBeTruthy();
  });

  it('should call the modifySwitchboard function', async () => {
    let modifySwitchboard = false;

    const ugFailedAndFailureBehaviourShutdown = makeUgFailedAndFailureBehaviourShutdown(
      {
        sendUpgradeFailureMail: () => null,
      }, {
        modifySwitchboard: () => {
          modifySwitchboard = true;
        },
      },
    );
    const fakeSlot = makeFakeSlot();
    await ugFailedAndFailureBehaviourShutdown(fakeSlot);
    expect(modifySwitchboard).toBeTruthy();
  });

  it('should successfully return the slot', async () => {
    const ugFailedAndFailureBehaviourShutdown = makeUgFailedAndFailureBehaviourShutdown(
      {
        sendUpgradeFailureMail: () => null,
      }, {
        modifySwitchboard: () => null,
      },
    );
    const fakeSlot = makeFakeSlot();
    const slotReturnedFromUseCase = await ugFailedAndFailureBehaviourShutdown(fakeSlot);
    expect(slotReturnedFromUseCase).toEqual(fakeSlot);
  });
});
