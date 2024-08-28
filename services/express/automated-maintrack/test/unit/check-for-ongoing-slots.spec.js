const expect = require('expect');

const { makeCheckForOngoingSlots } = require('./../../use-cases/check-for-ongoing-slots');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Unit Test: Check for ongoing slots use case', () => {
  it('should throw an error if any slots are ongoing', (done) => {
    const fakeSlot = makeFakeSlot({ slotStatus: 'ongoing' });

    const checkForOngoingSlots = makeCheckForOngoingSlots(
      { searchForSlots: () => [fakeSlot] },
    );

    checkForOngoingSlots(0).catch((error) => {
      expect(error.message).toBe('There is 1 slots ongoing, therefore cannot kick off slot');
    })
      .then(done, done);
  });
});
