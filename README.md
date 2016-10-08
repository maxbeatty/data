# Data: a Slack bot

[![npm](https://img.shields.io/npm/l/botkit.svg)](https://spdx.org/licenses/MIT)

A Node.js app that primarly harnesses [botkit](https://github.com/howdyai/botkit/blob/master/readme-slack.md) to interface with Slack.

## How to Deploy to Heroku

Data lives on Heroku at [spbk-data.herokuapp.com](spbk-data.herokuapp.com). To deploy a branch to Heroku, execute the following in order:

* Make sure you have the project (this repository) cloned locally.
* `heroku git:remote -a spbk-data` to set the Heroku instance as a remote.
* `git push heroku master` to deploy the `master` branch to Heroku or `git push heroku +my_branch:master` to override Heroku's maser branch with a different branch.
* At this point, "Data" should show up as a user in Slack.

## Heroku Commands

First, you need to log into Heroku:
* `heroku login [-a spbk-data]`

You can view the logs on your Heroku app with:
* `heroku logs --tail [-a spbk-data]`

## Environment Variables

- `SLACK_RTM_TOKEN` - [see Botkit's docs](https://github.com/howdyai/botkit/blob/e4fe9c7a038530a66d55f6a9ab32afdf92bbe8c5/readme-slack.md#getting-started)
- `DEBUG` - any value will enable extra logging

## Data Commands

Data recognizes the following commands in Slack:

* `@data hello`: replies with a greeting
* `@data show me a character` (regex: /.*character.*/): prints a random character from the Star Trek universe to the current channel.
* `@data auth0`: [see README](lib/scripts/auth0/README.md)

### Adding new commands

1. create a new directory in `lib/scripts/`
2. create a new file `index.js` in your new directory
3. export a function that accepts a bot controller and logger as arguments
4. document functionality in a `README.md` in your new directory

```js
const patterns = 'hello';
const types = ['direct_message', 'direct_mention', 'mention'];

function hello(controller, logger) {
  logger.debug('registering hello');
  controller.hears(patterns, types, (bot, message) => {
    bot.reply(message, 'Hello. How are you seeking advice?');
  });
}

module.exports = hello;
```

## Contributing

### Linting

Follow [this reasonable approach to JavaScript](https://github.com/airbnb/javascript)

```
npm run lint
```

### Test

Lint && Test

```
npm test
```

Do not use any Jest variant of `before` or `after` since they are global and apply to _all_ tests causing unintended consequences.
