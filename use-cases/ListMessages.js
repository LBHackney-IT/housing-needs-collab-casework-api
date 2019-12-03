function ListMessages(options){
  const dbGateway = new options.dbGateway()

  return async function(number){
    return await dbGateway.getMessages(number);
  }
}

module.exports = ListMessages;
