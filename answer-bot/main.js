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

const react = (name, timestamp) => {
  return instance.post('reactions.add', {
    channel: process.env.BIGARD_CHANNEL,
    name,
    timestamp,
  });
};

const reply = (timestamp) => {
  return instance.post('chat.postMessage', {
    channel: process.env.BIGARD_CHANNEL,
    text: "OUAIS C'EST D'LA BLAGUE !",
    thread_ts: timestamp,
  });
};

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/', async (req, res) => {
  if (req.body.user_id !== process.env.FAVORITE_USER) {
    log(`Incorrect message from ${req.body.user_id}`);
    const anwser = answers[Math.floor(Math.random() * answers.length)];

    log(req.body.timestamp);

    await react('nazi', req.body.timestamp);

    res
      .status(200)
      .json({
        text: `<@${req.body.user_id}> ${anwser}`,
      })
      .end();
  } else {
    await react('heart_eyes', req.body.timestamp);
    await reply(req.body.timestamp);
    log('Correct message !');
  }

  return res.status(200).end();
});

app.listen(3000);
log('Server started on port 3000');
