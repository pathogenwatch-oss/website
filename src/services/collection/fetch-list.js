const Collection = require('models/collection');

module.exports = function ({ user }) {
  return (
    Collection.
      find({ $or: (user ? [ { _user: user } ] : []).concat({ public: true }) })
  );
};
