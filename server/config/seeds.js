const db = require('./connection');
const { User } = require('../models');

db.once('open', async () => {
await User.deleteMany();

  await User.create({
    username: 'firstuser',
    email: 'test1@test.com',
    password: 'password1234'
  });

  await User.create({
    username: 'seconduser',
    email: 'test2@test.com',
    password: 'password1234'
  });

  console.log('users seeded!');

  process.exit();
});