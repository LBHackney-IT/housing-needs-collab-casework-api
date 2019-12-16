function initUseCases(options) {
  return {
    sendMessage: require('./SendMessage')(options),
    receiveMessage: require('./ReceiveMessage')(options),
    listMessages: require('./ListMessages')(options),
    createContact: require('./CreateContact')(options),
    createUser: require('./CreateUser')(options),
    listContacts: require('./ListContacts')(options),
    getContact: require('./GetContact')(options)
  };
}

module.exports = initUseCases;
