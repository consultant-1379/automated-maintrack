const express = require('express');

const {
  postTimePeriod,
  getTimePeriod,
  deleteTimePeriod,
} = require('./../controllers');
const { makeExpressCallback } = require('../../express-callback');

const router = express.Router();

router.post('/', makeExpressCallback(postTimePeriod));
router.get('/', makeExpressCallback(getTimePeriod));
router.delete('/:id', makeExpressCallback(deleteTimePeriod));

module.exports = router;
