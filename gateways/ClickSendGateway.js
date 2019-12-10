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
}

module.exports = ClickSendGateway;
