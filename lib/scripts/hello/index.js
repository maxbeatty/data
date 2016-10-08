const patterns = 'hello';
const types = ['direct_message', 'direct_mention', 'mention'];

function hello(controller, logger) {
  logger.debug('registering hello');
  controller.hears(patterns, types, (bot, message) => {
    bot.reply(message, 'Hello. How are you seeking advice?');
  });
}

module.exports = hello;
