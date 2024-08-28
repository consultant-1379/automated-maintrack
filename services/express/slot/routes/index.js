const express = require('express');

const {
  postSlot,
  getSlot,
  getSlots,
  searchSlots,
  patchSlot,
} = require('./../controllers');
const { makeExpressCallback } = require('../../express-callback');

const router = express.Router();

router.get('/search', makeExpressCallback(searchSlots));
router.post('/', makeExpressCallback(postSlot));
router.get('/', makeExpressCallback(getSlots));
router.get('/:id', makeExpressCallback(getSlot));
router.patch('/:id', makeExpressCallback(patchSlot));

module.exports = router;
