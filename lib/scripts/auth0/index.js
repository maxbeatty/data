const help = require('./help');
const Api = require('./_api');

function auth0(controller, logger) {
  logger.debug('registering auth0');

  help(controller, logger);

  const api = new Api(logger);

  function getSlackUser(bot, user) {
    return new Promise((resolve, reject) => {
      bot.api.users.info({ user }, (err, resp) => {
        if (err) {
          logger.error('slack api error', err);
          reject('💩 problem calling Slack API. check my logs');
        } else if (!resp.ok) {
          logger.error('slack response not ok', resp);
          reject('💩 bad response from Slack API. check my logs');
        } else {
          resolve(resp.user);
        }
      });
    });
  }

  controller.hears(
    [/^add <@(U.+)> to [Aa]uth0\s?$/],
    ['direct_mention'],
    (bot, message) => {
      // get new user's email address
      logger.debug('message', message);
      getSlackUser(bot, message.match[1])
      .then((user) => {
        if (
          user.is_bot ||
          user.is_restricted ||
          user.is_ultra_restricted ||
          user.deleted
        ) {
          logger.debug('slack api response', user);
          bot.reply(message, 'Sorry, I\'m afraid I can\'t add other bots, restricted users, or deleted users');
        } else {
          // create new user with user and app metadata
          logger.debug('slack api response', user);
          const newUser = {
            connection: 'email',
            email: user.profile.email,
            name: user.real_name, // Max Beatty
            nickname: user.name, // maxb
            user_metadata: {
              slack_id: user.id,
              team_id: user.team_id,
              first_name: user.profile.first_name, // Max
              last_name: user.profile.last_name, // Beatty
            },
            app_metadata: {
              authorizer: message.user,
              where: message.channel,
              when: message.ts,
            },
          };

          logger.debug('auth0 createUser', { newUser });
          api.createUser(newUser)
          .then(() => bot.reply(message, `Successfully added <@${message.match[1]}> (${user.profile.email}) to Auth0!`))
          .catch(() => bot.reply(message, '💩 didn\'t create user in Auth0. check my logs'));
        }
      })
      .catch(errMsg => bot.reply(message, errMsg));
    }
  );

  controller.hears(
    [/^remove <@(U.+)> from [Aa]uth0\s?$/],
    ['direct_mention'],
    (bot, message) => {
      logger.debug('message', message);
      getSlackUser(bot, message.match[1])
      // 1. make user exists in Auth0
      .then(user => api.findUser(user.id))
      // 2. delete the user from Auth0
      .then(auth0User => api.deleteUser(auth0User.user_id))
      .then(() => bot.reply(message, `Successfully deleted <@${message.match[1]}> from Auth0`))
      .catch(errMsg => bot.reply(message, errMsg));
    }
  );
}

module.exports = auth0;
