const Collection = require('models/collection');
const Genome = require('models/genome');

module.exports = function ({ user }) {
  return (
    Promise.all([
      Collection.count({ $or: (user ? [ { _user: user } ] : []).concat({ public: true }) }),
      user ? Collection.count({ _user: user }) : Promise.resolve(0),
      Genome.count({ $or: (user ? [ { _user: user } ] : []).concat({ public: true }) }),
      user ? Genome.count({ _user: user }) : Promise.resolve(0),
    ]).
    then(
      ([ allCollections, userCollections, allGenomes, userGenomes ]) =>
        ({ allCollections, userCollections, allGenomes, userGenomes })
    )
  );
};
