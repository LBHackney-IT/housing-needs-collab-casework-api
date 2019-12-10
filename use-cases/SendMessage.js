function SendMessage(options) {
  const smsGateway = new options.smsGateway();
  const dbGateway = new options.dbGateway();

  return async function(userId, message, username) {
    const contact = await dbGateway.getContact(userId);
    const namedMessage = `${message.trim()}\n- ${username} @ Hackney`;

    if (await smsGateway.sendMessage(contact.number, namedMessage)) {
      await dbGateway.saveMessage(userId, 'outgoing', namedMessage, username);
    }

    return { message: namedMessage };
  };
}

module.exports = SendMessage;
