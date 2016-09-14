// If the environgment does not have the proper env variables set, exit early.
// SLACK_RTM_TOKEN: Slack Real Time Token
// PROJECT_ROOT: The root directory of the project
if (!process.env.SLACK_RTM_TOKEN || !process.env.PROJECT_ROOT) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

require('./scripts/characters');
