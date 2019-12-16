function ReceiveMessage(options) {
  const dbGateway = new options.dbGateway();

  return async function(number, message) {
    let contact = await dbGateway.getContactByNumber(number);
    return await dbGateway.saveMessage(contact.id, null, 'incoming', message);
  };
}

module.exports = ReceiveMessage;
