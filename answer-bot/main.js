const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const axios = require('axios');

require('dotenv').config();

const app = express();

const answers = [
  'ok t mor',
  'je vais te goomer',
  'Va manger tes grands morts',
  "J'VAIS PRENDRE T'ES GRANDS MORTS ET EN FAIRE UNE MARINADE ET TU LA BOUFFERAS PAR LE NEZ",
  'ESPECE DE SALE PICARD, VA BAISER TA TANTE',
];

const log = (msg) => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${msg}`);
};

const instance = axios.create({
  baseURL: 'https://slack.com/api/',
  headers: {
    Authorization: `Bearer ${process.env.BIGARD_TOKEN}`,
  },
});

//app.use(bodyParser.text());
app.use(bodyParser.json());

app.post('/', async (req, res) => {
  // Respond to url challenge
  if (req.body.type === 'url_verification') {
    return res.status(200).send(req.body.challenge).end();
  }

  // response to Slack as quickly as possible to avoid resend event
  res.status(200).end();

  const { event } = req.body;

  const reply = (message) => {
    log(`Post message ${message}`);
    return instance.post('chat.postMessage', {
      channel: event.channel,
      text: message,
    });
  };

  const react = (name) => {
    return instance.post('reactions.add', {
      channel: event.channel,
      name,
      timestamp: event.ts,
    });
  };

  // Normalize white spaces
  event.text = event.text.replace(/\s+/g, ' ');

  // Check if the event is a message and not from a bot
  if (req.body.type === 'event_callback' && !event.bot_id) {
    // REPEAT RESPONSE
    let regex = /[Dd][iI](.*)/g;
    let match;
    while ((match = regex.exec(event.text))) {
      const answer = match[1];
      if (answer.length >= 2) {
        await reply(answer);
      }
    }
    // console.log(event.text.charAt(5));
    // console.log(event.text.charCodeAt(5));
    // console.log(' '.charCodeAt(0));
    // INSULT/LOVE RESPONSE
    if (event.text.startsWith("C'EST D'LA BLAGUE OU PAS")) {
      // If Fabien
      if (event.user !== process.env.FAVORITE_USER) {
        const answer = answers[Math.floor(Math.random() * answers.length)];
        reply(`<@${event.user}> ${answer}`);
        react('nazi');
      } else {
        reply("OUAIS C'EST D'LA BLAGUE !");
        react('heart_eyes');
      }
    }
  }

  return res.status(200).end();
});

app.listen(3000);
log('Server started on port 3000');
