# Data: a Slack bot

[![npm](https://img.shields.io/npm/l/botkit.svg)](https://spdx.org/licenses/MIT)

A Node.js app that primarly harnesses [botkit](https://github.com/howdyai/botkit/blob/v0.4.1/readme-slack.md#getting-started) to interface with Slack.

Automatically deploys to Heroku when CI passes against `master`.

## Environment Variables

- `SLACK_RTM_TOKEN` - API token from Slack Bot integration
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

### Dependencies

When you add, remove, or update a dependency, use the `npm` CLI.

```
npm install package@1.2.3 --save --save-exact
```

`npm-shrinkwrap.json` should be updated any time dependencies change. If `npm` does not do this for you, run:

```
npm shrinkwrap --dev
```
