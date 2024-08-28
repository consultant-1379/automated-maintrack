const expect = require('expect');

const { makeUpdateSlot } = require('./../../use-cases/modify-slot');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');
const { createSlot } = require('../../entities');

describe('Unit Test: modify slot use case', () => {
  it('mocks the modification of a slot from the database', async () => {
    const newSlot = makeFakeSlot();
    const updateSlot = makeUpdateSlot({
      findById: () => [newSlot],
      update: () => newSlot,
    }, createSlot);

    const updatedSlot = await updateSlot({
      id: newSlot.id,
    });

    expect(updatedSlot).toEqual(newSlot);
  });
});
