var ClickSend = require('../node_modules/clicksend/api');

class ClickSendGateway {
  async sendMessage(number, message, username) {
    const sms = new ClickSend.SmsMessage();

    sms.from = process.env.SMS_NUMBER;
    sms.to = number;
    sms.body = `${message.trim()}\n- ${username}, Hackney Council`;

    const smsApi = new ClickSend.SMSApi(
      process.env.CLICKSEND_USERNAME,
      process.env.CLICKSEND_API_KEY
    );

    const smsCollection = new ClickSend.SmsMessageCollection();
    smsCollection.messages = [sms];

    try {
      const res = await smsApi.smsSendPost(smsCollection);
      if (res.body.http_code === 200) {
        return sms.body;
      }
      return '';
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = ClickSendGateway;
