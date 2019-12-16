function GetUser(options) {
  const dbGateway = new options.dbGateway();

  return async function(id) {
    return await dbGateway.getUser(id);
  };
}

module.exports = GetUser;
