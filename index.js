require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpress = require('aws-serverless-express');
const app = express();
const server = awsServerlessExpress.createServer(app)

app.get('/test', async (req, res, next) => {
  res.status(200).send('Hello World!')
})
const port = process.env.PORT || 3000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
  getContact,
  createUserAndSendMessage
} = require('./use-cases')(gateways);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  // had to rewrite the path to get it playing nice with a not-root resource in api gateway
  req.url = req.url.replace('/hn-collab-casework', '');
  next();
});

// Middleware to check for a valid JWT token
app.use(function(req, res, next) {
  try {
    if (req.method !== 'OPTIONS') {
      let token =
        req.query.apikey || req.headers.authorization.replace('Bearer ', '');
      jwt.verify(token, process.env.JWT_SECRET);

      // pass along the username and email
      const decoded = jwt.decode(token);
      res.locals.user = {
        username: decoded.name,
        email: decoded.email
      };
    }
    next();
  } catch (err) {
    console.log('Invalid JWT Token');
    res.sendStatus(403);
  }
});

app.post('/contacts', async (req, res) => {
  try {
    let result;
    result = await createContact(
      req.body.name,
      req.body.number,
      req.body.jigsawId
    );
    res.redirect(`/contacts/${result.id}`);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get('/contacts/:id', async (req, res) => {
  try {
    let contact = await getContact(req.params.id);
    res.send(contact);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get('/contacts', async (req, res) => {
  console.log('getting contacts');
  try {
    let contacts = await listContacts();
    res.send(contacts);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post('/contacts/:id/messages', async (req, res) => {
  try {
    let response = await sendMessage(
      req.params.id,
      req.body.message,
      res.locals.user
    );
    res.send(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post('/receive_message', async (req, res) => {
  try {
    await receiveMessage(req.body.from, req.body.message);
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post('/messages', async (req, res) => {
  try {
    await createUserAndSendMessage(
      req.body.number,
      req.body.name,
      req.body.message,
      res.locals.user
    );
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get('/contacts/:id/messages', async (req, res) => {
  try {
    // Fetch the messages
    const messages = await listMessages(req.params.id);
    res.send(messages);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports.universal = (event, context) => awsServerlessExpress.proxy(server, event, context);
