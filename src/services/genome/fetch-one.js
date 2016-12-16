const Genome = require('data/genome');

module.exports = function ({ id, user }) {
  return (
    Genome.
      findOne({
        _id: id,
        $or: (user ? [ { _user: user } ] : []).concat({ public: true }),
      }).
      populate('_file')
  );
};
