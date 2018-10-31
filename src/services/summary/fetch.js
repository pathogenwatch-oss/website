const Collection = require('models/collection');
const Genome = require('models/genome');
const Organism = require('models/organism');

module.exports = async function (props) {
  const { user } = props;
  const binPrefilter = { user, query: { prefilter: 'bin' } };

  const [
    allCollections,
    userCollections,
    binnedCollections,
    allGenomes,
    userGenomes,
    binnedGenomes,
    numOrganisms,
    deployedOrganisms,
  ] = await Promise.all([
    Collection.count(Collection.getPrefilterCondition(props)),
    user ? Collection.count({ binned: false, _user: user }) : Promise.resolve(0),
    user ? Collection.count(Collection.getPrefilterCondition(binPrefilter)) : Promise.resolve(0),
    Genome.count(Genome.getPrefilterCondition(props)),
    user ? Genome.count({ binned: false, _user: user }) : Promise.resolve(0),
    user ? Genome.count(Genome.getPrefilterCondition(binPrefilter)) : Promise.resolve(0),
    Genome.distinct('analysis.speciator.organismId', Genome.getPrefilterCondition(props))
      .then(result => result.length),
    Organism.deployedOrganismIds(user),
  ]);

  const output = {
    allCollections,
    userCollections,
    binnedCollections,
    allGenomes,
    userGenomes,
    binnedGenomes,
    numOrganisms,
    deployedOrganisms,
  };

  return output;
};
