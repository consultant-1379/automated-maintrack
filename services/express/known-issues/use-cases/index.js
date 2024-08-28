const { makeCreateKnownIssue } = require('./create-known-issue');
const { makeListKnownIssues } = require('./list-known-issues');
const { makeSearchForKnownIssues } = require('./search-known-issues');
const { makeRemoveKnownIssue } = require('./remove-known-issue');
const { makeRetrieveListOfKnownIssuesNames } = require('./retrieve-list-of-known-issues-names');
const { dbOperator } = require('../../data-access');

const { createKnownIssue } = require('../entities');

const createNewKnownIssue = makeCreateKnownIssue(dbOperator, createKnownIssue);
const listKnownIssues = makeListKnownIssues(dbOperator);
const searchForKnownIssues = makeSearchForKnownIssues(dbOperator);
const removeKnownIssue = makeRemoveKnownIssue(dbOperator);
const retrieveListOfKnownIssuesNames = makeRetrieveListOfKnownIssuesNames(dbOperator);

const knownIssuesService = Object.freeze({
  createNewKnownIssue,
  listKnownIssues,
  searchForKnownIssues,
  removeKnownIssue,
  retrieveListOfKnownIssuesNames,
});

module.exports = {
  knownIssuesService,
  createNewKnownIssue,
  listKnownIssues,
  searchForKnownIssues,
  removeKnownIssue,
  retrieveListOfKnownIssuesNames,
};
