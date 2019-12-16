function SendMessage(options) {
  const smsGateway = new options.smsGateway();
  const dbGateway = new options.dbGateway();

  return async function(contactId, message, user) {
    const contact = await dbGateway.getContact(contactId);

    let systemUser = await dbGateway.getUserByUsername(user.username);

    if (!systemUser) {
      systemUser = await dbGateway.createUser(user.username, user.email);
    }

    const namedMessage = `${message.trim()}\n- ${user.username} @ Hackney`;

    if (await smsGateway.sendMessage(contact.number, namedMessage)) {
      await dbGateway.saveMessage(
        contactId,
        systemUser.id,
        'outgoing',
        namedMessage
      );
    }

    return { message: namedMessage };
  };
}

module.exports = SendMessage;
