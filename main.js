const lib = require('./lib');

// SLACK_RTM_TOKEN: Slack Real Time Messaging Token
if (!process.env.SLACK_RTM_TOKEN) {
  console.error('Specify SLACK_RTM_TOKEN in environment'); // eslint-disable-line no-console
  process.exit(1);
}

lib.start(process.env.SLACK_RTM_TOKEN);
