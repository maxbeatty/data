const characters = require('./characters.json');

const MENTION_HEARS_PATTERN = '(.*)character(.*)';
const MENTION_TYPES = ['direct_message', 'direct_mention', 'mention'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randChar(controller) {
  controller.hears(MENTION_HEARS_PATTERN, MENTION_TYPES, (bot, message) => {
    const randomIndex = getRandomInt(0, characters.length);
    const c = characters[randomIndex];
    bot.reply(message, `\n*Name:* ${c.name}
*Rank*: ${c.rank}
*Position*: ${c.position}
*Species*: ${c.species}\n`);
  });
}

module.exports = randChar;
