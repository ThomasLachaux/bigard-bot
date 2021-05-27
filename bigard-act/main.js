const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');

require('dotenv').config();

const web = new WebClient(process.env.SLACK_BOT_TOKEN);
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

const slackChannel = process.env.SLACK_CHANNEL;

// For a message, check if it was send by Fabien, if so, send love, otherwise, send hate
slackEvents.on('message', (event) => {
  console.log(event);
  // Ignore the message if it is not one, or sent by another bot
  if (event.type !== 'message' || event.subtype === 'bot_message') return;
});

// Log errors
slackEvents.on('error', (error) => {
  console.error(error);
});

(async () => {
  const server = await slackEvents.start(process.env.PORT);

  console.log(`Listening for events on ${server.address().port}`);
})().catch(console.error);
