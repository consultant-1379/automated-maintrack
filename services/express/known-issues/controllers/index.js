const { makePostKnownIssue } = require('./post-known-issue');
const { makeGetKnownIssues } = require('./get-known-issues');
const { makeSearchKnownIssues } = require('./search-known-issues');
const { makeDeleteKnownIssue } = require('./delete-known-issue');

const {
  createNewKnownIssue,
  listKnownIssues,
  searchForKnownIssues,
  removeKnownIssue,
} = require('../use-cases');

const postKnownIssue = makePostKnownIssue({ createNewKnownIssue });
const getKnownIssues = makeGetKnownIssues({ listKnownIssues });
const searchKnownIssues = makeSearchKnownIssues({ searchForKnownIssues });
const deleteKnownIssue = makeDeleteKnownIssue({ removeKnownIssue });

const knownIssueController = Object.freeze({
  postKnownIssue,
  getKnownIssues,
  searchKnownIssues,
  deleteKnownIssue,
});

module.exports = {
  knownIssueController,
  postKnownIssue,
  getKnownIssues,
  searchKnownIssues,
  deleteKnownIssue,
};
