function ListMessages(options) {
  const dbGateway = new options.dbGateway();

  return async function(userId) {
    return await dbGateway.getMessages(userId);
  };
}

module.exports = ListMessages;
