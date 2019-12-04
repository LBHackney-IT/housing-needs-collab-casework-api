function CreateContact(options) {
  const dbGateway = new options.dbGateway();

  return async function(name, number, jigsawId) {
    return await dbGateway.createContact(name, number, jigsawId);
  };
}

module.exports = CreateContact;
