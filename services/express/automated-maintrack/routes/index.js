const express = require('express');

const {
  triggerPostSlotActions,
  populateSlotProductSetVersion,
} = require('./../controllers');
const { makeExpressCallback } = require('../../express-callback');

const router = express.Router();

router.patch('/execute-post-slot-actions/:id', makeExpressCallback(triggerPostSlotActions));
router.patch('/populate-product-set-version/:id', makeExpressCallback(populateSlotProductSetVersion));

module.exports = router;
