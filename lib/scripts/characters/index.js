const characters = require('./characters.json');

const patterns = '(.*)character(.*)';
const types = ['direct_message', 'direct_mention', 'mention'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randChar(controller, logger) {
  logger.debug('registering characters');
  controller.hears(patterns, types, (bot, message) => {
    const randomIndex = getRandomInt(0, characters.length);
    const c = characters[randomIndex];
    bot.reply(message, `\n*Name*: ${c.name}
*Rank*: ${c.rank}
*Position*: ${c.position}
*Species*: ${c.species}\n`);
  });
}

module.exports = randChar;
