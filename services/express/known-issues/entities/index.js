const { buildMakeKnownIssue } = require('./known-issues');
const { Id } = require('./../../Id');

const createKnownIssue = buildMakeKnownIssue({ Id });

module.exports = { createKnownIssue };
