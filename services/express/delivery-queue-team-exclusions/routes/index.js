const express = require('express');

const {
  postExcludedTeam,
  getExcludedTeams,
  searchExcludedTeams,
  deleteExcludedTeam,
} = require('./../controllers');
const { makeExpressCallback } = require('../../express-callback');

const router = express.Router();

router.get('/search', makeExpressCallback(searchExcludedTeams));
router.post('/', makeExpressCallback(postExcludedTeam));
router.get('/', makeExpressCallback(getExcludedTeams));
router.delete('/:id', makeExpressCallback(deleteExcludedTeam));

module.exports = router;
