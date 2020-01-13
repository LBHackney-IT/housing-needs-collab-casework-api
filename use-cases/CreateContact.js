function CreateContact(options) {
  const dbGateway = new options.dbGateway();
  const smsGateway = new options.smsGateway();

  return async function(name, number, jigsawId) {
    const contact = await dbGateway.createContact(name, number, jigsawId);

    if (contact) {
      const onboardingMessages = [
        'Hackney Council are trying out a new text message service. For the next 6 weeks, you may receive text messages from an officer you’ve spoken with. You can reply to these messages. We expect to reply within 2 working days.',
        'After 6 weeks we will ask for your feedback. This will help us decide whether or not to continue running the text message service. Thank you. Benefits and Housing Needs Service, Hackney Council.',
        'If at any point you want to stop receiving text messages, please text STOP.'
      ];

      let systemUser = await dbGateway.getUserByUsername('No Reply');
      if (!systemUser) systemUser = await dbGateway.createUser('No Reply');

      for (const message of onboardingMessages) {
        await smsGateway.sendMessage(contact.number, message);
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
