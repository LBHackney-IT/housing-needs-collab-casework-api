var ClickSend = require('../node_modules/clicksend/api');

class ClickSendGateway {
  async sendMessage(number, message) {
    const sms = new ClickSend.SmsMessage();

    sms.from = process.env.SMS_NUMBER;
    sms.to = number;
    sms.body = message;

    const smsApi = new ClickSend.SMSApi(
      process.env.CLICKSEND_USERNAME,
      process.env.CLICKSEND_API_KEY
    );

    const smsCollection = new ClickSend.SmsMessageCollection();
    smsCollection.messages = [sms];

    try {
      const res = await smsApi.smsSendPost(smsCollection);
      return res.body.http_code === 200;
    } catch (err) {
      console.error(err);
    }
  }

  async sendNewMessageNotification(contactName, userName, emailTo) {
    const emailApi = new ClickSend.TransactionalEmailApi(
      process.env.CLICKSEND_USERNAME,
      process.env.CLICKSEND_API_KEY
    );

    const emailRecipient = new ClickSend.EmailRecipient();
    emailRecipient.name = userName;
    emailRecipient.email = emailTo;

    const emailFrom = new ClickSend.EmailFrom();
    emailFrom.emailAddressId = 4197;
    emailFrom.name = 'noreply';

    const email = new ClickSend.Email();
    email.to = [emailRecipient];
    email.from = emailFrom;
    email.subject = 'New SMS received';
    email.body = `<p>Hello,</p><p>You have received a new SMS from ${contactName}. Please visit <a href="${process.env.UI_URL}">${process.env.UI_URL}</a> to check your messages.</p>`;

    try {
      const res = await emailApi.emailSendPost(email);
      return res.body.http_code === 200;
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = ClickSendGateway;
