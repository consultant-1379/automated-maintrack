const expect = require('expect');

const { makeListSlots } = require('./../../use-cases/list-slots');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

describe('Unit Test: List slots use case', () => {
  it('mocks the listing of slots from the database', async () => {
    const newSlot1 = makeFakeSlot();
    const newSlot2 = makeFakeSlot();
    const listSlot = makeListSlots({
      findAll: () => [newSlot1, newSlot2],
    });

    const retrieved = await listSlot({});
    expect(retrieved).toEqual([newSlot1, newSlot2]);
  });
});
