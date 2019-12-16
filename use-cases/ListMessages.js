function ListMessages(options) {
  const dbGateway = new options.dbGateway();

  return async function(contactId) {
    return await dbGateway.getMessages(contactId);
  };
}

module.exports = ListMessages;
