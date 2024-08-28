const express = require('express');

const {
  postKnownIssue,
  getKnownIssues,
  searchKnownIssues,
  deleteKnownIssue,
} = require('./../controllers');
const { makeExpressCallback } = require('../../express-callback');

const router = express.Router();

router.get('/search', makeExpressCallback(searchKnownIssues));
router.post('/', makeExpressCallback(postKnownIssue));
router.get('/', makeExpressCallback(getKnownIssues));
router.delete('/:id', makeExpressCallback(deleteKnownIssue));

module.exports = router;
