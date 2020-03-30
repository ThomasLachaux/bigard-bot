const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

const answers = ['ok t mor', 'je vais te goomer', 'Va manger tes grands morts'];

const log = msg => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${msg}`);
};

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/', (req, res) => {
  if (req.body.user_id !== 'UGGNZP5NJ') {
    log(`Incorrect message from ${req.body.user_id}`);
    const anwser = answers[Math.floor(Math.random() * answers.length)];

    res
      .status(200)
      .json({
        text: `<@${req.body.user_id}> ${anwser}`
      })
      .end();
  } else {
    log('Correct message !');
  }

  return res.status(200).end();
});

app.listen(3000);
log('Server started on port 3000');
