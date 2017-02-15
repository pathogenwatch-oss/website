const Genome = require('models/genome');

const { scrollingPageSize } = require('configuration');
const limit = scrollingPageSize || 10;

module.exports = function ({ user, query = {} }) {
  const { page = 0 } = query;
  const skip = page * limit;

  return (
    Genome.
      find(
        { $or: (user ? [ { _user: user } ] : []).concat({ public: true }) },
        null,
        { skip, limit }
      ).
      populate('_file').
      then(genomes => genomes.map(_ => _.toObject({ user })))
  );
};
