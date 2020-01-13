function initUseCases(options) {
  const useCases = {};
  useCases.sendMessage = require('./SendMessage')(options, useCases);
  useCases.receiveMessage = require('./ReceiveMessage')(options, useCases);
  useCases.listMessages = require('./ListMessages')(options, useCases);
  useCases.createContact = require('./CreateContact')(options, useCases);
  useCases.createUser = require('./CreateUser')(options, useCases);
  useCases.listContacts = require('./ListContacts')(options, useCases);
  useCases.getContact = require('./GetContact')(options, useCases);
  return useCases;
}

module.exports = initUseCases;
