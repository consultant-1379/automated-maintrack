const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const exporter = require('./exporter');

require('./config/config');
require('./cron/eventHandlers/cron.events');
require('./slot-cleanup/eventHandlers/cron.events');

// Define routes here
const automatedMaintrackRoutes = require('./automated-maintrack/routes');
const slotRoutes = require('./slot/routes');
const switchboardRoutes = require('./switchboard/routes');
const knownIssueRoutes = require('./known-issues/routes');
const timePeriodRoutes = require('./time-period/routes');
const excludedTeamRoutes = require('./delivery-queue-team-exclusions/routes');

const app = express();

app.use(exporter.requestCounters);
app.use(exporter.responseCounters);

exporter.injectMetricsRoute(app);
exporter.startCollection();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Methods', 'DELETE, HEAD, GET, POST, PUT, OPTIONS');
  next();
});
app.use(cors());

// Set our api routes
app.use('/slots', slotRoutes);
app.use('/switchboard', switchboardRoutes);
app.use('/known-issues', knownIssueRoutes);
app.use('/amt', automatedMaintrackRoutes);
app.use('/time-period', timePeriodRoutes);
app.use('/delivery-queue-team-exclusions', excludedTeamRoutes);

const port = process.env.PORT || '3000';

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

module.exports = { app };
