const Botkit = require('botkit');

const characters = require('./characters.json');
const MENTION_HEARS_PATTERN = '(.*)character(.*)';
const MENTION_TYPES = ['direct_message', 'direct_mention', 'mention'];

const CONTROLLER = Botkit.slackbot({
  debug: false,
  // include 'log: false' to disable logging
  // or a 'logLevel' integer from 0 to 7 to adjust logging verbosity
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// connect the bot to a stream of messages
CONTROLLER.spawn({
  token: process.env.SLACK_RTM_TOKEN,
}).startRTM();

// give the bot something to listen for.
CONTROLLER.hears(MENTION_HEARS_PATTERN, MENTION_TYPES, (bot, message) => {
  const randomIndex = getRandomInt(0, characters.length);
  const c = characters[randomIndex];
  bot.reply(message, `\n*Name:* ${c.name}
*Rank*: ${c.rank}
*Position*: ${c.position}
*Species*: ${c.species}\n`);
});
