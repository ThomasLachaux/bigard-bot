const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');

require('dotenv').config();

const web = new WebClient(process.env.SLACK_BOT_TOKEN);
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

const slackChannel = process.env.SLACK_CHANNEL;

const answers = [
  'ok t mor',
  'je vais te goomer',
  'Va manger tes grands morts',
  "J'VAIS PRENDRE T'ES GRANDS MORTS ET EN FAIRE UNE MARINADE ET TU LA BOUFFERAS PAR LE NEZ",
  'ESPECE DE SALE PICARD, VA BAISER TA TANTE',
];

const leaveMessages = [
  'tu penses que c\'est du respect mon garçon ?',
  't\'as cru que t\'allais partir comme ça ?',
  'hop hop hop, on revient fissa'
]

// For a message, check if it was send by Fabien, if so, send love, otherwise, send hate
slackEvents.on('message', (event) => {
  console.log(event)
  // Ignore the message if it is not one, was posted on another channel, or sent by another bot
  if(event.type !== 'message' || event.channel !== slackChannel || event.subtype === 'bot_message' || !event.text.toUpperCase().startsWith('C\'EST D\'LA BLAGUE OU PAS'))
    return;

    // Default message to answer
    let reaction = 'nazi';
    let message = answers[Math.floor(Math.random() * answers.length)];

    // If Fabien sent the message
    if(event.user === process.env.FAVORITE_USER) {
      reaction = 'heart_eyes';
      message = 'OUAIS C\'EST D\'LA BLAGUE !';
    }

    console.log(`Send message ${message} to ${event.user}`);

    // Post the message
    web.chat.postMessage({
      text: `<@${event.user}> ${message}`,
      channel: slackChannel
    });

    // Post the reaction
    web.reactions.add({
      channel: slackChannel,
      name: reaction,
      timestamp: event.ts
    });
});

slackEvents.on('member_left_channel', (event) => {
  console.log(event);
  // Check if the user has leave the correct channel
  if(event.channel !== slackChannel || event.channel_type !== 'C')
    return;

  // Reinvite the member
  web.conversations.invite({
    channel: slackChannel,
    users: event.user
  });


  const leaveMessage = leaveMessages[Math.floor(Math.random() * leaveMessages.length)];
  web.chat.postMessage({
    text: `<@${event.user}> ${leaveMessage}`,
    channel: event.channel
  });
});

// Log errors
slackEvents.on('error', (error) => {
  console.error(error);
});

(async() => {
  const server = await slackEvents.start(process.env.PORT);

  console.log(`Listening for events on ${server.address().port}`);
})().catch(console.error)