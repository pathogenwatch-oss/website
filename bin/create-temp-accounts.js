const argv = require('named-argv');
const mongoConnection = require('utils/mongoConnection');
// const { ISODate } = require('mongoose').Types;

const User = require('models/user');

(async () => {
  await mongoConnection.connect();

  const { email = 'tempuser@pathogen.watch', total = 1, index = 0, token, expires = 5 } = argv.opts;

  const date = new Date();
  const expiryDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + expires);

  for (let i = index; i < total; i++) {
    const [ user, domain ] = email.split('@');
    const uid = `${user}${i + 1}@${domain}`;

    await User.create({
      providerType: 'passwordless',
      providerId: uid,
      name: uid,
      email: uid,
    });

    await User.db.collection('passwordless-token').insert({
      hashedToken: token,
      uid,
      ttl: expiryDate,
    });
  }

  process.exit(0);
})();
