const expect = require('expect');

const { makeInitiateSwitchboard } = require('../../use-cases/initiate-switchboard');

describe('initiate switchboard', () => {
  it('should not initiate a switchboard if failed to get the number of switchboards in the database', (done) => {
    const initiateSwitchboard = makeInitiateSwitchboard(
      () => null,
      () => null,
    );

    initiateSwitchboard().catch((error) => {
      expect(error.message).toBe('Failed to retrieve number of switchboards in the database when trying to initiate switchboards');
    }).then(done, done);
  });
});
