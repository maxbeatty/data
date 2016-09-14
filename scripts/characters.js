var Botkit = require('botkit');
var cheerio = require('cheerio'), cheerioTableparser = require('cheerio-tableparser');
const fs = require('fs');
const CHARACTERS_FILE = process.env.PROJECT_ROOT + '/static_data/characters.html';
// console.log(CHARACTERS_FILE);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

// Parse characters.html file to get list of characters
var character_count = 0;

// Open characters.html
fs.readFile(CHARACTERS_FILE, 'utf8', function(err, contents) {
  $ = cheerio.load(contents);
  cheerioTableparser($);
  characters = $("#characters").parsetable(true, true, true);
  character_count = characters[0].length;
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
  random_character_index = getRandomInt(0, character_count);
  var name = characters[0][random_character_index];
  var rank = characters[4][random_character_index] == null ? "n/a" : characters[4][random_character_index];
  var position = characters[5][random_character_index] == null ? "n/a" : characters[5][random_character_index];
  var species = characters[6][random_character_index];
  character = "*Name:* " + name + "\n" +
              "*Rank*: " + rank + "\n" +
              "*Position*: " + position + "\n" +
              "*Species*: " + species + "\n";
  bot.reply(message, character);
});
