const Botkit = require('botkit');

// add new commands below
const characters = require('./scripts/characters');
const hello = require('./scripts/hello');

exports.start = function start(token) {
  const controller = Botkit.slackbot();

  // add new commands below
  characters(controller);
  hello(controller);

  // connect the bot to a stream of messages
  controller.spawn({
    token,
    retry: 3,
  }).startRTM((err, bot, payload) => {
    if (err) {
      console.error(err); // eslint-disable-line no-console
    } else {
      console.dir(payload); // eslint-disable-line no-console
    }
  });
};
