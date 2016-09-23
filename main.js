const Botkit = require('botkit');
const winston = require('winston');

const characters = require('./scripts/characters');
const hello = require('./scripts/hello');

winston.level = 'debug';

// SLACK_RTM_TOKEN: Slack Real Time Token
if (!process.env.SLACK_RTM_TOKEN) {
  winston.error('Specify SLACK_RTM_TOKEN in environment');
  process.exit(1);
}

const controller = Botkit.slackbot({
  debug: false,
});

characters(controller);
hello(controller);

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACK_RTM_TOKEN,
}).startRTM();
