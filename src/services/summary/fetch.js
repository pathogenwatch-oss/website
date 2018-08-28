const Collection = require('models/collection');
const Genome = require('models/genome');
const Organism = require('models/organism');

module.exports = function (props) {
  const { user } = props;
  const binPrefilter = { user, query: { prefilter: 'bin' } };
  return (
    Promise.all([
      Collection.count(Collection.getPrefilterCondition(props)),
      user ? Collection.count({ binned: false, _user: user }) : Promise.resolve(0),
      user ? Collection.count(Collection.getPrefilterCondition(binPrefilter)) : Promise.resolve(0),
      Genome.count(Genome.getPrefilterCondition(props)),
      user ? Genome.count({ binned: false, _user: user }) : Promise.resolve(0),
      user ? Genome.count(Genome.getPrefilterCondition(binPrefilter)) : Promise.resolve(0),
      Genome.distinct('organismId', Genome.getPrefilterCondition(props))
        .then(result => result.length),
      Organism.distinct('taxId'),
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
