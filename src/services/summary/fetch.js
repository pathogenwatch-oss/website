const Collection = require('models/collection');
const Genome = require('models/genome');
const Reference = require('models/reference');

module.exports = function (props) {
  const { user } = props;
  return (
    Promise.all([
      Collection.count(Collection.getPrefilterCondition(props)),
      user ? Collection.count({ binned: false, _user: user }) : Promise.resolve(0),
      user ? Collection.count({ binned: true, _user: user }) : Promise.resolve(0),
      Genome.count(Genome.getPrefilterCondition(props)),
      user ? Genome.count({ binned: false, _user: user }) : Promise.resolve(0),
      user ? Genome.count({ binned: true, _user: user }) : Promise.resolve(0),
      Genome.distinct('organismId', Genome.getPrefilterCondition(props))
        .then(result => result.length),
      Reference.distinct('organismId'),
    ]).
    then(([
      allCollections,
      userCollections,
      binnedCollections,
      allGenomes,
      userGenomes,
      binnedGenomes,
      numOrganisms,
      deployedOrganisms,
    ]) => ({
      allCollections,
      userCollections,
      binnedCollections,
      allGenomes,
      userGenomes,
      binnedGenomes,
      numOrganisms,
      deployedOrganisms,
    }))
  );
};
