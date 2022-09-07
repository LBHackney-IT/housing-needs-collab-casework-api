module.exports = (options, useCases) => {
  const smsGateway = new options.smsGateway();
  const dbGateway = new options.dbGateway();

  const normaliseNumber = (number) => {
    number = number
      .replace(/[^0-9]/g, '') // remove non digits
      .replace(/^0*/, '') // remove leading '00s'
      .replace(/^(44){1}/, '') // remove leading '44'
      .replace(/^0{1}/, ''); // remove leading '0'

    const isMobile = RegExp(/^7[0-9]{9}$/);
    return isMobile.test(number) ? `+44${number}` : false;
  }

  return async (number, name, message, user) => {
    let contact;
    number = normaliseNumber(number);
    if(!number) throw new Error("Bad mobile number");

    // look up or create the contact
    try{
      console.log(`attempting to get contact...`)
      contact = await dbGateway.getContactByNumber(number);
      console.log(`got contact.`)
    }catch(err){
      if(err.code === 0){
        console.log(`attempting to create contact...`)
        contact = await useCases.createContact(name, number);
        console.log(`created contact ${JSON.stringify(contact)}`)
      }
    }

    // look up or create the system user
    console.log(`attempting to get system user...`)
    let systemUser = await dbGateway.getUserByUsername(user.username);
    if (!systemUser) {
      console.log(`no system user found. creating...`)
      systemUser = await dbGateway.createUser(user.username, user.email);
      console.log(`created system user ${JSON.stringify(systemUser)}`)
    }

    const namedMessage = `${message.trim()}\n- ${user.username} @ Hackney`;

    console.log(`attempting to send message... ${JSON.stringify(namedMessage)}`)

    if (await smsGateway.sendMessage(contact.number, namedMessage)) {
      await dbGateway.saveMessage(
        contact.id,
        systemUser.id,
        'outgoing',
        namedMessage
      );
    }

    return { contact, message: namedMessage };
  };
}
