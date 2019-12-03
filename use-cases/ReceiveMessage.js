function ReceiveMessage(options){
  const dbGateway = new options.dbGateway()

  return async function(number, message){
    return await dbGateway.saveMessage(number, 'incoming', message, 'Customer');
  }
}

module.exports = ReceiveMessage;
