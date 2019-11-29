require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');
const ClickSendGateway = require('./gateways/ClickSendGateway');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  // had to rewrite the path to get it playing nice with a not-root resource in api gateway
  req.url = req.url.replace('/hn-collab-casework', '');
  next();
});

app.post('/send_sms', async (req, res) => {
  const clickSendGateway = new ClickSendGateway();
  const response = await clickSendGateway.sendMessage(
    req.body.number,
    req.body.message
  );
  res.send(response);
});

app.post('/receive_sms', async (req, res) => {
  console.log(req);
  res.status(200).send();
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports.handler = serverless(app);
