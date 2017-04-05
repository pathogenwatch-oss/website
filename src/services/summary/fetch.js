const Collection = require('models/collection');
const Genome = require('models/genome');
const Organism = require('models/organism');

module.exports = function (props) {
  const { user } = props;
  return (
    Promise.all([
      Collection.count(Collection.getPrefilterCondition(props)),
      user ? Collection.count({ binned: false, _user: user }) : Promise.resolve(0),
      Genome.count(Genome.getPrefilterCondition(props)),
      user ? Genome.count({ binned: false, _user: user }) : Promise.resolve(0),
      Organism.deployedOrganismIds(),
    ]).
    then(
      ([ allCollections, userCollections, allGenomes, userGenomes, deployedOrganisms ]) =>
        ({ allCollections, userCollections, allGenomes, userGenomes, deployedOrganisms })
    )
  );
};
