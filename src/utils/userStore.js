const User = require('../data/user');
const Organisation = require('../data/organisation');

module.exports = {
  serialize(user, done) {
    done(null, user.id);
  },
  deserialize(id, done) {
    User.findById(id)
    .populate('organisation')
    .exec((err, user) => done(err, user));
  },
  save({ type, id, name, email, photo }, done) {
    User.findOne({ providerType: type, providerId: id })
      .then(user => {
        // log the user in if the user is found
        if (user) return done(null, user);

        // create a new user if there is no user found with the same profile ID
        const newUser = new User({
          providerType: type,
          providerId: id,
          name,
          email,
          photo,
        });

        // save the user to the database
        return newUser.save(done);
      })
      .catch(done);
  },
};
