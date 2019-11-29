const AWS = require('aws-sdk');

class SnsGateway {
  async sendMessage() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    const ans = new AWS.SNS({ apiVersion: '2010-03-31' });

    try {
      const smsAttributes = {
        attributes: {
          DefaultSMSType: 'Promotional'
        }
      };

      await ans.setSMSAttributes(smsAttributes).promise();

      const message = {
        Message: 'this is a test',
        PhoneNumber: '+44xxx'
      };

      return await ans.publish(message).promise();
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = SnsGateway;
