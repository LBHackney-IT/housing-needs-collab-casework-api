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
      return await smsApi.smsSendPost(smsCollection);
    } catch (err) {
      console.error(err);
    }
  }

  async receiveMessage(message) {}
}

module.exports = ClickSendGateway;
