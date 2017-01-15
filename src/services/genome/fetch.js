const Genome = require('models/genome');

module.exports = function ({ user }) {
  return (
    Genome.
      find({ $or: (user ? [ { _user: user } ] : []).concat({ public: true }) }).
      populate('_file')
  );
};
