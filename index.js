require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');
const gateways = {
  smsGateway: require('./gateways/ClickSendGateway'),
  dbGateway: require('./gateways/PostgresGateway')
};
const { sendMessage, receiveMessage, listMessages } = require('./use-cases')(
  gateways
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  // had to rewrite the path to get it playing nice with a not-root resource in api gateway
  req.url = req.url.replace('/hn-collab-casework', '');
  next();
});

app.post('/messages/send', async (req, res) => {
  let response = sendMessage(
    req.body.number,
    req.body.message,
    'Officer' // This will come from the auth token in the future
  );
  res.send(response);
});

app.post('/messages/receive', async (req, res) => {
  receiveMessage(req.body.from, req.body.message);
  res.status(200).send();
});

app.get('/messages', async (req, res) => {
  // Fetch the messages
  const messages = await listMessages();
  // Group them by number
  let grouped = messages.reduce((acc, msg) => {
    if (!acc[msg.number]) acc[msg.number] = [];
    acc[msg.number].push(msg);
    return acc;
  }, {});
  res.send(grouped);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports.handler = serverless(app);
