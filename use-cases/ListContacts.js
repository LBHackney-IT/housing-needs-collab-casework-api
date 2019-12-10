function ListContacts(options) {
  const dbGateway = new options.dbGateway();

  return async function(search) {
    return await dbGateway.listContacts(search);
  };
}

module.exports = ListContacts;
