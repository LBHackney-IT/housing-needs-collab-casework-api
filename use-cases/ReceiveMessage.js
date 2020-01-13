const isWeekend = () => {
  var day = new Date().getDay();
  return day === 6 || day === 0;
};

const isOutOfHours = () => {
  var hour = new Date().getHours();
  return hour < 9 || hour > 16;
};

const outOfHoursMessage =
  'Thanks for your message. This inbox is monitored Monday to Friday, 9am-5pm. We expect to reply to your message within 2 working days.';

function ReceiveMessage(options, useCases) {
  const dbGateway = new options.dbGateway();
  const smsGateway = new options.smsGateway();

  return async function(number, message) {
    const contact = await dbGateway.getContactByNumber(number);
    const user = await dbGateway.getLastUser(contact.id);
    // Save message to the DB
    await dbGateway.saveMessage(contact.id, user.id, 'incoming', message);

    // Send the user a notification
    if (user) {
      await smsGateway.sendNewMessageNotification(
        contact.name,
        user.username,
        user.email
      );
    }

    // Send an out of hours response to the customer if needed
    if (isWeekend() || isOutOfHours()) {
      await useCases.sendMessage(contact.id, outOfHoursMessage, 'No Reply');
    }
  };
}

module.exports = ReceiveMessage;
