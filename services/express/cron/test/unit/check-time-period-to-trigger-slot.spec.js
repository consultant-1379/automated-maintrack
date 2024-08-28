const expect = require('expect');
const { spy, assert: sinAssert } = require('sinon');
const moment = require('moment');
const { buildCheckTimePeriodToTriggerSlot } = require('../../use-cases/check-time-period-to-trigger-slot');

const fakeTimePeriods = {
  notFinished: {
    id: 1,
    lengthOfTimePeriod: '00:15',
    timePeriodStart: moment().subtract(10, 'minutes'),
    timePeriodEnd: moment().add(5, 'minutes'),
  },
  finished: {
    id: 2,
    lengthOfTimePeriod: '00:15',
    timePeriodStart: moment().subtract(15, 'minutes'),
    timePeriodEnd: moment(),
  },
};

const fakeTimePeriodsService = {
  timePeriodFinished: {
    listTimePeriod: () => [fakeTimePeriods.finished],
    createNewTimePeriod: data => data,
    removeTimePeriod: id => id,
  },
  timePeriodNotfinished: {
    listTimePeriod: () => [fakeTimePeriods.notFinished],
    createNewTimePeriod: data => data,
    removeTimePeriod: id => id,
  },
};

const spyObj = {
  timePeriodFinished: {
    listTimePeriod: spy(fakeTimePeriodsService.timePeriodFinished, 'listTimePeriod'),
    createNewTimePeriod: spy(fakeTimePeriodsService.timePeriodFinished, 'createNewTimePeriod'),
    removeTimePeriod: spy(fakeTimePeriodsService.timePeriodFinished, 'removeTimePeriod'),
  },
  timePeriodNotfinished: {
    listTimePeriod: spy(fakeTimePeriodsService.timePeriodNotfinished, 'listTimePeriod'),
    createNewTimePeriod: spy(fakeTimePeriodsService.timePeriodNotfinished, 'createNewTimePeriod'),
    removeTimePeriod: spy(fakeTimePeriodsService.timePeriodNotfinished, 'removeTimePeriod'),
  },
};

const checkTimePeriodToTriggerSlot = {
  finished: buildCheckTimePeriodToTriggerSlot(moment, spyObj.timePeriodFinished),
  notFinished: buildCheckTimePeriodToTriggerSlot(moment, spyObj.timePeriodNotfinished),
};

describe('Unit Test: Check time period to trigger slot use case', () => {
  it('if the time period finished, amt should create a new one and kick off a slot', async () => {
    expect(await checkTimePeriodToTriggerSlot.finished()).toBe(true);
    sinAssert.calledOnce(spyObj.timePeriodFinished.listTimePeriod);
    sinAssert.calledOnce(spyObj.timePeriodFinished.createNewTimePeriod);
    sinAssert.calledOnce(spyObj.timePeriodFinished.removeTimePeriod);
    sinAssert.callOrder(spyObj.timePeriodFinished.listTimePeriod, spyObj.timePeriodFinished.createNewTimePeriod,
      spyObj.timePeriodFinished.removeTimePeriod);
  });
  it('if the time period has not finished, amt should just wait another minute', async () => {
    expect(await checkTimePeriodToTriggerSlot.notFinished()).toBe(undefined);
    sinAssert.calledOnce(spyObj.timePeriodNotfinished.listTimePeriod);
    sinAssert.notCalled(spyObj.timePeriodNotfinished.createNewTimePeriod);
    sinAssert.notCalled(spyObj.timePeriodNotfinished.removeTimePeriod);
  });
});
