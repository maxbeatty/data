const Botkit = require('botkit');
const winston = require('winston');
const path = require('path');
const fs = require('fs');

exports.start = function start(token) {
  const controller = Botkit.slackbot();

  // dynamically load all commands in the scripts directory
  winston.level = process.env.DEBUG ? 'debug' : 'info';
  winston.debug('ENABLED');

  const scriptsPath = path.resolve(__dirname, 'scripts');
  const scripts = fs.readdirSync(scriptsPath);
  winston.debug('found', { scripts });

  winston.debug('loading scripts...');
  scripts.forEach((s) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(path.resolve(scriptsPath, s))(controller, winston);
  });

  // connect the bot to a stream of messages
  controller.spawn({
    token,
    retry: 3,
  }).startRTM((err) => {
    if (err) {
      winston.error(err);
    }
  });
};
