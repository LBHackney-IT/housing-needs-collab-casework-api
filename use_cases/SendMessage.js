function SendMessage(options){
  const smsGateway = new options.smsGateway();
  const dbGateway = new options.dbGateway();

  return async function(number, message, username) {
    await dbGateway.saveMessage(number, 'outgoing', message, username);
    return await smsGateway.sendMessage(number, message);
  }
}

module.exports = SendMessage;
