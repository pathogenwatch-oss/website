const Genome = require('models/genome');

module.exports = function ({ user }) {
  return (
    Genome.
      find({ $or: (user ? [ { _user: user } ] : []).concat({ public: true }) }, { __v: 0 }).
      populate('_file').
      then(genomes => genomes.map(_ => _.toObject({ user })))
  );
};
