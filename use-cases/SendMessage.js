function SendMessage(options) {
  const smsGateway = new options.smsGateway();
  const dbGateway = new options.dbGateway();

  return async function(userId, message, username) {
    const contact = await dbGateway.getContact(userId);
    const sentMessage = await smsGateway.sendMessage(
      contact.number,
      message,
      username
    );

    if (sentMessage) {
      await dbGateway.saveMessage(userId, 'outgoing', sentMessage, username);
    }

    return { message: sentMessage };
  };
}

module.exports = SendMessage;
