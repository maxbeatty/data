module.exports = function help(controller, logger) {
  logger.debug('registering auth0 help');

  // controller.hears(
  //   [/^[Aa]uth0(\shelp)?\s?$/],
  //   ['direct_mention', 'direct_message'],
  //   (bot, message) => {
  //     bot.reply(message, 'Auth0 usage: `add @user to Auth0` or `remove @user from Auth0`');
  //   });
};
