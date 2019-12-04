function SendMessage(options) {
  const smsGateway = new options.smsGateway();
  const dbGateway = new options.dbGateway();

  return async function(userId, message, username) {
    await dbGateway.saveMessage(userId, 'outgoing', message, username);
    let contact = await dbGateway.getContact(userId);
    return await smsGateway.sendMessage(contact.number, message);
  };
}

module.exports = SendMessage;
