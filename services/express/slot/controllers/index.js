const { makePostSlot } = require('./post-slot');
const { makeGetSlot } = require('./get-slot');
const { makeGetSlots } = require('./get-slots');
const { makeSearchSlots } = require('./search-slots');
const { makePatchSlot } = require('./patch-slot');

const {
  createNewSlot,
  listSlot,
  listSlots,
  searchForSlots,
  modifySlot,
} = require('../use-cases');

const postSlot = makePostSlot({ createNewSlot });
const getSlot = makeGetSlot({ listSlot });
const getSlots = makeGetSlots({ listSlots });
const searchSlots = makeSearchSlots({ searchForSlots });
const patchSlot = makePatchSlot({ modifySlot });

const slotController = Object.freeze({
  postSlot,
  getSlot,
  getSlots,
  searchSlots,
  patchSlot,
});

module.exports = {
  slotController,
  postSlot,
  getSlot,
  getSlots,
  searchSlots,
  patchSlot,
};
