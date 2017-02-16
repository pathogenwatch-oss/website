const Genome = require('models/genome');

module.exports = function ({ user, query = {} }) {
  const { skip = 0, limit = 0 } = query;

  return (
    Genome.
      find(
        { $or: (user ? [ { _user: user } ] : []).concat({ public: true }) },
        null,
        { skip: Number(skip), limit: Number(limit) }
      ).
      populate('_file').
      then(genomes => genomes.map(_ => _.toObject({ user })))
  );
};
