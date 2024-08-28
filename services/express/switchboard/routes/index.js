const express = require('express');

const {
  patchSwitchboard,
  getSwitchboard,
} = require('./../controllers');
const { makeExpressCallback } = require('../../express-callback');

const router = express.Router();

router.patch('/', makeExpressCallback(patchSwitchboard));
router.get('/', makeExpressCallback(getSwitchboard));

module.exports = router;
