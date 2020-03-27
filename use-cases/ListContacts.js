function ListContacts(options) {
  const dbGateway = new options.dbGateway();

  return async function() {
    return await dbGateway.listContacts();
  };
}

module.exports = ListContacts;
