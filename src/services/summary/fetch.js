const Collection = require('models/collection');
const Genome = require('models/genome');

module.exports = function ({ user }) {
  return (
    Promise.all([
      Collection.count({ binned: false, $or: [ { _user: user }, { public: true } ] }),
      user ? Collection.count({ binned: false, _user: user }) : Promise.resolve(0),
      Genome.count({ binned: false, $or: [ { _user: user }, { public: true } ] }),
      user ? Genome.count({ binned: false, _user: user }) : Promise.resolve(0),
    ]).
    then(
      ([ allCollections, userCollections, allGenomes, userGenomes ]) =>
        ({ allCollections, userCollections, allGenomes, userGenomes })
    )
  );
};
