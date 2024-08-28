const expect = require('expect');
const moment = require('moment');
const { spy, assert: sinAssert } = require('sinon');

const { buildCheckTimePeriodToTriggerSlot } = require('../../../cron/use-cases/check-time-period-to-trigger-slot');
const { timePeriodsService } = require('../../../time-period/use-cases');

const timePeriodsServiceSpy = {
  listTimePeriod: timePeriodsService.listTimePeriod,
  createNewTimePeriod: timePeriodsService.createNewTimePeriod,
  removeTimePeriod: timePeriodsService.removeTimePeriod,
};

const spyObj = {
  listTimePeriod: spy(timePeriodsServiceSpy, 'listTimePeriod'),
  createNewTimePeriod: spy(timePeriodsServiceSpy, 'createNewTimePeriod'),
  removeTimePeriod: spy(timePeriodsServiceSpy, 'removeTimePeriod'),
};

const checkTimePeriodToTriggerSlot = buildCheckTimePeriodToTriggerSlot(moment, spyObj);
describe('Unit Test: Check time period to trigger slot use case', () => {
  before(async () => {
    await timePeriodsService.createNewTimePeriod({ lengthOfTimePeriod: '0:1' });
  });
  afterEach(() => {
    spyObj.listTimePeriod.resetHistory();
    spyObj.createNewTimePeriod.resetHistory();
    spyObj.removeTimePeriod.resetHistory();
  });
  after(async () => {
    const [storedTimePeriod] = await timePeriodsService.listTimePeriod();
    await timePeriodsService.removeTimePeriod(storedTimePeriod);
  });
  it('if the time period has not finished, amt should just wait another minute', async () => {
    expect(await checkTimePeriodToTriggerSlot()).toBe(undefined);
    sinAssert.calledOnce(spyObj.listTimePeriod);
    sinAssert.notCalled(spyObj.createNewTimePeriod);
    sinAssert.notCalled(spyObj.removeTimePeriod);
  });
  it('if the time period finished, amt should create a new one and kick off a slot', async () => {
    const [storedTimePeriod] = await timePeriodsService.listTimePeriod();
    await timePeriodsService.removeTimePeriod(storedTimePeriod);
    await timePeriodsService.createNewTimePeriod({
      lengthOfTimePeriod: '0:1',
      timePeriodEnd: moment().subtract('1', 'minute'),
    });
    expect(await checkTimePeriodToTriggerSlot()).toBe(true);
    sinAssert.calledOnce(spyObj.listTimePeriod);
    sinAssert.calledOnce(spyObj.createNewTimePeriod);
    sinAssert.calledOnce(spyObj.removeTimePeriod);
    sinAssert.callOrder(spyObj.listTimePeriod, spyObj.createNewTimePeriod,
      spyObj.removeTimePeriod);
  });
});
