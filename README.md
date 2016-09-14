# Data - Spaceback's bot

[![npm](https://img.shields.io/npm/l/botkit.svg)](https://spdx.org/licenses/MIT)

Spaceback is a Node app that primarly harnesses [botkit](https://github.com/howdyai/botkit/blob/master/readme-slack.md) to interface with Slack.

## How to Deploy to Heroku

Data lives on Heroku at [spbk-data.herokuapp.com](spbk-data.herokuapp.com). To deploy a branch to Heroku, execute the following in order:

* Make sure you have the project (this repository) cloned locally.
* `heroku git:remote -a spbk-data` to set the Heroku instance as a remote.
* `git push heroku master` to deploy the `master` branch to Heroku or `git push heroku +my_branch:master` to override Heroku's maser branch with a different branch.
* At this point, "Data" should show up as a user in Slack.

## Commands

Data recognizes the following commands in Slack:

* `@data show me a character` (regex: /.*character.*/): prints a random character from the Star Trek universe to the current channel.
