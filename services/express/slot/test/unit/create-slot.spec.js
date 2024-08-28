const expect = require('expect');

const { makeCreateSlot } = require('./../../use-cases/create-slot');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');
const { createSlot } = require('../../entities');

describe('Unit Test: Create slot use case', () => {
  it('mocks the insertion of a slot in the database', async () => {
    const newSlot = makeFakeSlot();
    const createSlots = makeCreateSlot({
      insert: () => newSlot,
    }, createSlot);

    const inserted = await createSlots(newSlot);
    expect(inserted).toMatchObject(newSlot);
  });
});
