require('dotenv').config();

const pgGateway = require('./gateways/PostgresGateway');
const db = new pgGateway();
const faker = require('faker');

const user_count = 20;
const message_count = 20;

(async () => {
  for (let u = 0; u < user_count; u++) {
    let { id } = await db.createContact(
      `${faker.name.firstName()} ${faker.name.lastName()}`,
      faker.phone.phoneNumber(),
      null
    );
    for (let m = 0; m < message_count; m++) {
      await db.saveMessage(
        id,
        faker.random.boolean() ? 'incoming' : 'outgoing',
        faker.lorem.sentence(),
        `${faker.name.firstName()} ${faker.name.lastName()}`
      );
    }
  }
})();
