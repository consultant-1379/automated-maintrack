const expect = require('expect');

const { makeRetrieveBugsAndTRsOnlyStatus } = require('../../use-cases/retrieve-bugs-or-trs-only-status');
const { makeFakeSwitchboard } = require('../../../__test__/fixtures/switchboard');

describe('Unit Test: Retrieve bugs and TRs only status use case', () => {
  it('should get the correct bugs and TRs only switch status', async () => {
    const validBugsAndTRsOnlyStatus = 'on';
    const newSwitchboard = makeFakeSwitchboard({
      bugsAndTRsOnlyStatus: validBugsAndTRsOnlyStatus,
    });
    const retrieveBugsAndTRsOnlyStatus = makeRetrieveBugsAndTRsOnlyStatus(
      () => [newSwitchboard],
    );
    const bugsAndTRsOnlyStatus = await retrieveBugsAndTRsOnlyStatus();
    expect(bugsAndTRsOnlyStatus).toEqual('on');
  });
  it('should fail if no switchboard detected', async () => {
    const retrieveBugsAndTRsOnlyStatus = makeRetrieveBugsAndTRsOnlyStatus(
      () => [],
    );
    await retrieveBugsAndTRsOnlyStatus()
      .catch((error) => {
        expect(error).toEqual(new Error('No switchboard detected. Please investigate.'));
      });
  });
  it('should fail if no bugs and TRs only status retrieved', async () => {
    const badSwitchboard = {
      getBugsAndTRsOnlyStatus: () => null,
    };
    const retrieveBugsAndTRsOnlyStatus = makeRetrieveBugsAndTRsOnlyStatus(
      () => [badSwitchboard],
    );
    await retrieveBugsAndTRsOnlyStatus()
      .catch((error) => {
        expect(error).toEqual(new Error('Failed to retrieve bugsAndTRsOnlyStatus.'));
      });
  });
});
