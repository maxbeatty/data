var Botkit = require('botkit');
var cheerio = require('cheerio'), cheerioTableparser = require('cheerio-tableparser');
const fs = require('fs');
const CHARACTERS_FILE = process.env.PROJECT_ROOT + 'static_data/characters.html';
//console.log(CHARACTERS_FILE);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

// Parse characters.html file to get list of characters
var characterCount = 0;

// Open characters.html
fs.readFile(CHARACTERS_FILE, 'utf8', function(err, contents) {
  $ = cheerio.load(contents);
  cheerioTableparser($);
  characters = $("#characters").parsetable(true, true, true);
  characterCount = characters[0].length;
  // console.log("Parsed " + character_count + " characters.");
});

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACK_RTM_TOKEN,
}).startRTM()

// give the bot something to listen for.
controller.hears('(.*)character(.*)',['direct_message','direct_mention','mention'], function(bot,message) {
  // Default character is Data
  var character = "Data";
  randomCharacterIndex = getRandomInt(0, characterCount);
  var name = characters[0][randomCharacterIndex];
  var rank = characters[4][randomCharacterIndex] == null
    ? "n/a"
    : characters[4][randomCharacterIndex];
  var position = characters[5][randomCharacterIndex] == null
    ? "n/a"
    : characters[5][randomCharacterIndex];
  var species = characters[6][randomCharacterIndex];
  character = "*Name:* " + name + "\n" +
              "*Rank*: " + rank + "\n" +
              "*Position*: " + position + "\n" +
              "*Species*: " + species + "\n";
  bot.reply(message, character);
});
