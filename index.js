require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const gateways = {
  smsGateway: require('./gateways/ClickSendGateway'),
  dbGateway: require('./gateways/PostgresGateway')
};
const {
  sendMessage,
  receiveMessage,
  listMessages,
  createContact,
  listContacts,
  getContact
} = require('./use-cases')(gateways);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  // had to rewrite the path to get it playing nice with a not-root resource in api gateway
  req.url = req.url.replace('/hn-collab-casework', '');
  next();
});

app.post('/contacts', async (req, res) => {
  try {
    let result;
    result = await createContact(req.body.name, req.body.number);
    res.redirect(`/contacts/${result.id}`);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
});

app.get('/contacts/:id', async (req, res) => {
  try {
    let contact = await getContact(req.params.id);
    res.send(contact);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
});

app.get('/contacts', async (req, res) => {
  try {
    let contacts = await listContacts();
    res.send(contacts);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
});

app.post('/contacts/:id/messages', async (req, res) => {
  try {
    let response = sendMessage(
      req.params.id,
      req.body.message,
      'Officer' // This will come from the auth token in the future
    );
    res.send(response);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
});

app.post('/messages', async (req, res) => {
  try {
    receiveMessage(req.body.from, req.body.message);
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.send(500);
  }
});

app.get('/contacts/:id/messages', async (req, res) => {
  try {
    // Fetch the messages
    const messages = await listMessages(req.params.id);
    res.send(messages);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports.handler = serverless(app);
