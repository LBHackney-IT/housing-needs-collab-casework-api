function GetContact(options) {
  const dbGateway = new options.dbGateway();

  return async function(id) {
    return await dbGateway.getContact(id);
  };
}

module.exports = GetContact;
