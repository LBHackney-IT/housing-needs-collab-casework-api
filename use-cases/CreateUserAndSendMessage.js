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
      contact = await dbGateway.getContactByNumber(number);
    }catch(err){
      if(err.code === 0){
        contact = await useCases.createContact(name, number);
      }
    }

    // look up or create the system user
    let systemUser = await dbGateway.getUserByUsername(user.username);
    if (!systemUser) {
      systemUser = await dbGateway.createUser(user.username, user.email);
    }

    const namedMessage = `${message.trim()}\n- ${user.username} @ Hackney`;

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
