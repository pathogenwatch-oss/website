const mongoConnection = require('../src/utils/mongoConnection');

module.exports = {
  serialize(user, done) {
    done(null, user.id);
  },
  deserialize(id, done) {
    if (typeof id === "string") {
      done(null, null);
    }
    else {
      database.User.findOne({ where: { id } })
        .then((user) => done(null, user))
        .catch(done);
    }
  },
  save({ type, id, name, email, photo }, done) {
    database.User.findOne({
      where: {
        loginProviderType: type,
        loginProviderId: id,
      },
    })
      .then((user) => {
        // log the user in if the user is found
        if (user) {
          user.set({ name, email, photo });
          return user.save();
        }

        // create a new user if there is no user found with the same profile ID
        return database.User.create(
          {
            loginProviderType: type,
            loginProviderId: id,
            name,
            email,
            photo,
          }
        );
      })
      .then((user) => done(null, user))
      .catch(done);
  },
};
