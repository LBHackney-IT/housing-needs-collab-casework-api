function ReceiveMessage(options) {
  const dbGateway = new options.dbGateway();
  const smsGateway = new options.smsGateway();

  return async function(number, message) {
    const contact = await dbGateway.getContactByNumber(number);
    const user = await dbGateway.getLastUser(contact.id);
    await dbGateway.saveMessage(contact.id, user.id, 'incoming', message);

    if (user) {
      await smsGateway.sendNewMessageNotification(
        contact.name,
        user.username,
        user.email
      );
    }
  };
}

module.exports = ReceiveMessage;
