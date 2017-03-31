const Collection = require('models/collection');
const Genome = require('models/genome');

module.exports = function (props) {
  const { user } = props;
  return (
    Promise.all([
      Collection.count(Collection.getPrefilterCondition(props)),
      user ? Collection.count({ binned: false, _user: user }) : Promise.resolve(0),
      Genome.count(Genome.getPrefilterCondition(props)),
      user ? Genome.count({ binned: false, _user: user }) : Promise.resolve(0),
    ]).
    then(
      ([ allCollections, userCollections, allGenomes, userGenomes ]) =>
        ({ allCollections, userCollections, allGenomes, userGenomes })
    )
  );
};
