
const { request } = require('services/bus');
const { getCollectionTask } = require('manifest');

const Collection = require('models/collection');
const Genome = require('models/genome');
const Organism = require('models/organism');

async function validate({ genomeIds, organismId, user }) {
  await request('collection', 'verify', { genomeIds, organismId, user });
  return genomeIds;
}

function getGenomes(genomeIds) {
  return Genome.find(
    { _id: { $in: genomeIds } },
    { latitude: 1, longitude: 1, 'analysis.core.fp.reference': 1 }
  )
  .lean();
}

function getLocations(genomes) {
  const locations = {};
  for (const { latitude, longitude } of genomes) {
    if (latitude && longitude) {
      locations[`${latitude}_${longitude}`] = [ latitude, longitude ];
    }
  }
  return Object.values(locations);
}

function getSubtrees(organismId, genomes, genomeIds) {
  const spec = getCollectionTask(organismId, 'subtree');
  if (!spec) return null;

  const fps = new Set();
  for (const { analysis = {} } of genomes) {
    if (analysis.core && analysis.core.fp && analysis.core.fp.reference) {
      fps.add(analysis.core.fp.reference);
    }
  }

  return Promise.all(
    Array.from(fps).map(async (name) => {
      const count = await Genome.count({
        $or: [ { population: true }, { _id: { $in: genomeIds } } ],
        'analysis.core.fp.reference': name,
        'analysis.speciator.organismId': organismId,
      });
      if (count > 1) {
        return {
          name,
          status: 'PENDING',
        };
      }
      return null;
    })
  ).then(subtrees => subtrees.filter(_ => _ !== null));
}

async function createCollection(genomes, { organismId, title, description, pmid, user }) {
  const size = genomes.length;
  const tree = genomes.length >= 3 ? { name: 'collection' } : null;

  const genomeIds = genomes.map(_ => _._id);
  const organism = await Organism.getLatest(organismId);
  const subtrees = await getSubtrees(organismId, genomes, genomeIds);

  return Collection.create({
    _organism: organism,
    _user: user,
    access: user ? 'private' : 'shared',
    description,
    genomes: genomeIds,
    locations: getLocations(genomes),
    organismId,
    pmid,
    size,
    subtrees,
    title,
    token: Collection.generateToken(title),
    tree,
  });
}

function submitCollection(collection) {
  const { _id, token, organismId } = collection;
  const submitType = collection.tree ? 'submit-tree' : 'submit-subtrees';
  return request('collection', submitType, {
    organismId,
    collectionId: _id,
    clientId: token,
  })
  .then(() => collection);
}

module.exports = function (message) {
  return Promise.resolve(message)
    .then(validate)
    .then(getGenomes)
    .then(genomes => createCollection(genomes, message))
    .then(submitCollection)
    .then(({ token }) => ({ token }));
};
