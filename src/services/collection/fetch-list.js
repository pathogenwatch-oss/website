const Collection = require('data/collection');

module.exports = function ({ user }) {
  return (
    Collection.
      find({ $or: (user ? [ { _user: user } ] : []).concat({ public: true }) })
  );
};
