const expect = require('expect');

const { makeFakeSlot } = require('../../../__test__/fixtures/slot');
const { createSlot } = require('../../entities');

describe('Unit Test: Slot entity', () => {
  it('must not allow slot creation if no slot status is given', () => {
    const slot = makeFakeSlot({ slotStatus: null });
    expect(() => createSlot(slot)).toThrow('You must provide a slotStatus value.');
  });

  it('must not allow an invalid slot status', () => {
    const slot = makeFakeSlot({ slotStatus: 'invalidStatus' });
    expect(() => createSlot(slot)).toThrow('You must use either ongoing, failure or success for the slotStatus value');
  });

  it('must not allow an invalid slot type', () => {
    const slot = makeFakeSlot({ slotType: 'invalidType' });
    expect(() => createSlot(slot)).toThrow('You must use either manual or automatic for the slotType value');
  });

  it('must have a valid id', () => {
    const slot = makeFakeSlot({ id: 'invalid' });
    expect(() => createSlot(slot)).toThrow('Slot must have a valid id.');
    const noId = makeFakeSlot({ id: undefined });
    expect(() => createSlot(noId)).not.toThrow();
  });

  it('can create an id if no id passed in', () => {
    const noId = makeFakeSlot({ id: undefined });
    const slot = createSlot(noId);
    expect(slot.getId()).toBeDefined();
  });

  it('is createdOn now in UTC', () => {
    const noCreationDate = makeFakeSlot({ createdOn: undefined });
    expect(noCreationDate.createdOn).not.toBeDefined();
    const date = createSlot(noCreationDate).getCreatedOn();
    expect(date).toBeDefined();
    expect(new Date(date).toUTCString().substring(26)).toBe('GMT');
  });

  it('must allow creation of a slot if it has either a physical or cloud environment associated with it', () => {
    const slot = makeFakeSlot({ physicalEnvironment: null });
    expect(() => createSlot(slot)).toBeTruthy();
  });

  it('must allow creation of a slot if it has either a physical or cloud status associated with it', () => {
    const slot = makeFakeSlot({ physicalStatus: null });
    expect(() => createSlot(slot)).toBeTruthy();
  });

  it('must ensure a slot has delivered DGs associated with it', () => {
    const slot = makeFakeSlot({ deliveredDGs: null });
    expect(() => createSlot(slot)).toThrow('A slot must have delivered DGs associated with it');
  });

  it('must ensure a slot has a product set version associated with it', () => {
    const slot = makeFakeSlot({ productSetVersion: null });
    expect(() => createSlot(slot)).toThrow('A slot must have a product set version associated with it');
  });

  it('must ensure a slot has a value for slot type', () => {
    const slot = makeFakeSlot({ slotType: null });
    expect(() => createSlot(slot)).toThrow('You must use either manual or automatic for the slotType value');
  });

  it('must ensure a slot should allow manual for slot type', () => {
    const slot = makeFakeSlot({ slotType: 'manual' });
    expect(() => createSlot(slot)).toBeTruthy();
  });

  it('must ensure a slot should allow automatic for slot type', () => {
    const slot = makeFakeSlot({ slotType: 'automatic' });
    expect(() => createSlot(slot)).toBeTruthy();
  });

  it('must ensure a slot has a valid product set version associated with it', () => {
    const slotWithInvalidProductSetVersion = makeFakeSlot({ productSetVersion: '20.04' });
    expect(() => createSlot(slotWithInvalidProductSetVersion)).toThrow('A slot must have a valid product set version or be pending a product set version');

    let slotWithValidProductSetVersion = makeFakeSlot({ productSetVersion: '20.04.111' });
    expect(() => createSlot(slotWithValidProductSetVersion)).toBeTruthy();

    slotWithValidProductSetVersion = makeFakeSlot({ productSetVersion: 'pending' });
    expect(() => createSlot(slotWithValidProductSetVersion)).toBeTruthy();

    slotWithValidProductSetVersion = makeFakeSlot({ productSetVersion: 'failure' });
    expect(() => createSlot(slotWithValidProductSetVersion)).toBeTruthy();
  });

  it('must allow for physical or cloud status and environment to be pending', () => {
    const slotWithPendingPhysical = makeFakeSlot({ physicalEnvironment: null, physicalStatus: null });
    const physicalSlot = createSlot(slotWithPendingPhysical);
    expect(physicalSlot.getPhysicalEnvironment()).toBe('pending');
    expect(physicalSlot.getPhysicalStatus()).toBe('pending');

    const slotWithPendingCloud = makeFakeSlot({ cloudEnvironment: null, cloudStatus: null });
    const cloudSlot = createSlot(slotWithPendingCloud);
    expect(cloudSlot.getCloudEnvironment()).toBe('pending');
    expect(cloudSlot.getCloudStatus()).toBe('pending');
  });

  it('must not allow slot creation if the bugAndTRsOnlyStatus is null or undefined.', () => {
    const nullSlot = makeFakeSlot({ bugsAndTRsOnlyStatus: null });
    expect(() => createSlot(nullSlot)).toThrow('A slot must contain a bugsAndTRsOnlyStatus of either on or off');
    const undefinedSlot = makeFakeSlot({ bugsAndTRsOnlyStatus: undefined });
    expect(() => createSlot(undefinedSlot)).toThrow('A slot must contain a bugsAndTRsOnlyStatus of either on or off');
  });

  it('must not allow slot creation if the bugAndTRsOnlyStatus is invalid.', () => {
    const slot = makeFakeSlot({ bugsAndTRsOnlyStatus: 'invalidStatus' });
    expect(() => createSlot(slot)).toThrow('A slot must contain a bugsAndTRsOnlyStatus of either on or off');
  });

  it('must not allow slot creation if the slotUgFailureBehaviour is null or undefined.', () => {
    const nullSlot = makeFakeSlot({ slotUgFailureBehaviour: null });
    expect(() => createSlot(nullSlot)).toThrow('A slot must contain a slotUgFailureBehaviour of either shutdown or obsolete');
    const undefinedSlot = makeFakeSlot({ slotUgFailureBehaviour: undefined });
    expect(() => createSlot(undefinedSlot)).toThrow('A slot must contain a slotUgFailureBehaviour of either shutdown or obsolete');
  });

  it('must not allow slot creation if the slotUgFailureBehaviour is invalid.', () => {
    const slot = makeFakeSlot({ slotUgFailureBehaviour: 'invalidStatus' });
    expect(() => createSlot(slot)).toThrow('A slot must contain a slotUgFailureBehaviour of either shutdown or obsolete');
  });
});
