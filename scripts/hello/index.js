const hears = 'hello';
const types = ['direct_message', 'direct_mention', 'mention'];

function hello(controller) {
  controller.hears(hears, types, (bot, message) => {
    bot.reply(message, 'Hello. How are you seeking advice?');
  });
}

module.exports = hello;
