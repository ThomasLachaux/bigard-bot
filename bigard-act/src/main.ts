import { WebClient } from '@slack/web-api';
import { createEventAdapter } from '@slack/events-api';
import dotenv from 'dotenv';

dotenv.config();

const web = new WebClient(process.env.SLACK_BOT_TOKEN);
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

slackEvents.on('message', (event) => {
  // Ignore the message if it is not one, or sent by another bot
  if (event.type !== 'message' || event.subtype === 'bot_message') return;

  // If is quoi
  if (event.text.match(/quoi *[\!\?]*$/i)) {
    console.log(`Answer quoi to ${event.user}`);
    web.chat.postMessage({
      channel: event.channel,
      text: 'feur',
      // If the message is in the thread, continues in the thead, otherwise, creates a thread
      thread_ts: event.thread_ts || event.ts,
    });
  }
});

// Log errors
slackEvents.on('error', (error) => {
  console.error(error);
});

(async () => {
  const port = Number(process.env.PORT) || 3000;
  await slackEvents.start(port);
  console.log(`Listening for events on ${port}`);
})().catch(console.error);
