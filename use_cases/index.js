function initUseCases(options){
  return {
    sendMessage: require('./SendMessage')(options),
    receiveMessage: require('./ReceiveMessage')(options)
  }
}

module.exports = initUseCases;
