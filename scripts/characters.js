const Botkit = require('botkit');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const fs = require('fs');

const MENTION_HEARS_PATTERN = '(.*)character(.*)';
const MENTION_TYPES = ['direct_message', 'direct_mention', 'mention'];
const CHARACTERS_FILE = `${process.env.PROJECT_ROOT}/static_data/characters.html`;
const CONTROLLER = Botkit.slackbot({
  debug: false,
  // include 'log: false' to disable logging
  // or a 'logLevel' integer from 0 to 7 to adjust logging verbosity
});

let characters = null;
let characterCount = 0;

// const winston = require('winston');
// winston.log('debug', CHARACTERS_FILE);

function getRandomInt(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(Math.random() * (newMax - newMin)) + newMin;
}

function readFileHandler(err, contents) {
  const $ = cheerio.load(contents);
  cheerioTableparser($);
  characters = $('#characters').parsetable(true, true, true);
  characterCount = characters[0].length;
  // winston.log('debug', 'Parsed ' + character_count + ' characters.');
}

// Open characters.html
function readFile() {
  fs.readFile(CHARACTERS_FILE, 'utf8', readFileHandler);
}

// Callback used by CONTROLLER.hears
function controllerHandler(bot, message) {
  // Default character is Data
  let character = 'Data';
  const randomIndex = getRandomInt(0, characterCount);
  const name = characters[0][randomIndex];
  const rank = characters[4][randomIndex] == null
    ? 'n/a'
    : characters[4][randomIndex];
  const position = characters[5][randomIndex] == null
    ? 'n/a'
    : characters[5][randomIndex];
  const species = characters[6][randomIndex];
  character = `\n*Name:* ${name}
*Rank*: ${rank}
*Position*: ${position}
*Species*: ${species}\n`;
  bot.reply(message, character);
}

readFile();

// connect the bot to a stream of messages
CONTROLLER.spawn({
  token: process.env.SLACK_RTM_TOKEN,
}).startRTM();

// give the bot something to listen for.
CONTROLLER.hears(MENTION_HEARS_PATTERN, MENTION_TYPES, controllerHandler);
