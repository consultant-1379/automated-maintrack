const expect = require('expect');

const { makeCheckForPendingProductSets } = require('./../../use-cases/check-for-pending-product-sets');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Unit Test: Check for pending product sets use case', () => {
  it('should throw an error if any product sets are pending', (done) => {
    let errorMessage;
    const fakeSlot = makeFakeSlot({ productSetVersion: 'pending' });
    const checkForPendingProductSets = makeCheckForPendingProductSets(
      { searchForSlots: () => [fakeSlot] },
    );

    checkForPendingProductSets().catch((error) => {
      errorMessage = error.message;
    })
      .then(async () => {
        expect(errorMessage).toBe('There is a slot currently pending product set creation, therefore cannot kick off slot.');
      })
      .then(done, done);
  });
});
