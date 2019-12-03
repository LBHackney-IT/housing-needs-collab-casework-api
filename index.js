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

app.post('/send_sms', async (req, res) => {
  let response = sendMessage(
    req.body.number,
    req.body.message,
    'user' // This will come from the auth token in the future
  );
  res.send(response);
});

app.post('/receive_sms', async (req, res) => {
  receiveMessage(req.body.from, req.body.message);
  res.status(200).send();
});

app.get('/sms', async (req, res) => {
  const messages = await listMessages(req.query.number);
  res.send(messages);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports.handler = serverless(app);
