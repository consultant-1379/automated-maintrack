const exec = require('child_process').execSync;

const { makeCreateSlot } = require('./create-slot');
const { makeListSlot } = require('./list-slot');
const { makeListSlots } = require('./list-slots');
const { makeSearchForSlots } = require('./search-slots');
const { makeUpdateSlot } = require('./modify-slot');
const { makePredictSlotObsoletions } = require('./predict-slot-obsoletions');
const { dbOperator } = require('../../data-access');

const { createSlot } = require('../entities');

const createNewSlot = makeCreateSlot(dbOperator, createSlot);
const listSlot = makeListSlot(dbOperator);
const listSlots = makeListSlots(dbOperator);
const searchForSlots = makeSearchForSlots(dbOperator);
const updateSlot = makeUpdateSlot(dbOperator, createSlot);
const modifySlot = makeUpdateSlot(dbOperator, createSlot);
const predictSlotObsoletions = makePredictSlotObsoletions(exec);

const slotService = Object.freeze({
  createNewSlot,
  listSlot,
  listSlots,
  searchForSlots,
  updateSlot,
  modifySlot,
  predictSlotObsoletions,
});

module.exports = {
  slotService,
  createNewSlot,
  listSlot,
  listSlots,
  searchForSlots,
  updateSlot,
  modifySlot,
  predictSlotObsoletions,
};
