const expect = require('expect');

const { makeListSlot } = require('./../../use-cases/list-slot');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Unit Test: List slot use case', () => {
  it('mocks the listing of a slot from the database', async () => {
    const newSlot = makeFakeSlot();
    const listSlot = makeListSlot({
      findById: () => newSlot,
    });

    const retrieved = await listSlot({
      id: newSlot.id,
    });

    expect(retrieved).toEqual(newSlot);
  });
});
