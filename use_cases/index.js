function initUseCases(options){
  return {
    sendMessage: require('./SendMessage')(options),
    receiveMessage: require('./ReceiveMessage')(options),
    listMessages: require('./ListMessages')(options)
  }
}

module.exports = initUseCases;
