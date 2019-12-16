function CreateUser(options) {
  const dbGateway = new options.dbGateway();

  return async function(username, email) {
    return await dbGateway.createUser(username, email);
  };
}

module.exports = CreateUser;
