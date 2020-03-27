function CreateContact(options) {
  const dbGateway = new options.dbGateway();
  const smsGateway = new options.smsGateway();

  return async function(name, number, jigsawId) {
    const contact = await dbGateway.createContact(name, number, jigsawId);

    if (contact) {
      const onboardingMessages = [
        'If at any point you want to stop receiving text messages from Hackney Council, please text STOP.'
      ];

      let systemUser = await dbGateway.getUserByUsername('No Reply');
      if (!systemUser) systemUser = await dbGateway.createUser('No Reply');

      for (const message of onboardingMessages) {
        await smsGateway.sendMessage(number, message);
        await dbGateway.saveMessage(
          contact.id,
          systemUser.id,
          'outgoing',
          message
        );
      }
    }

    return contact;
  };
}

module.exports = CreateContact;
