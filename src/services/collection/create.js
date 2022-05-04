const { request } = require('services/bus');
const { getCollectionTask } = require('manifest');

const Collection = require('models/collection');
const Genome = require('models/genome');
const Organism = require('models/organism');
const GenomeCollection = require('models/genomecollection');

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

function getSubtrees(organismId, genomes, genomeIds, user) {
  const spec = getCollectionTask(organismId, 'subtree', user);
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
  ).then((subtrees) => subtrees.filter((_) => _ !== null));
}


function getTree(organismId, size, user) {
  if (!organismId) return null;
  if (!(getCollectionTask(organismId, 'tree', user))) return null;
  return size >= 3 ? { name: 'collection' } : null;
}

async function createCollection(genomes, { organismId, organismName, title, description, literatureLink, user }) {
  const organism = await Organism.getLatest(organismId);
  const size = genomes.length;
  const tree = getTree(organismId, size, user);
  const genomeIds = genomes.map((_) => _._id);
  const subtrees = await getSubtrees(organismId, genomes, genomeIds, user);
  const parsedLiteratureLink = literatureLink.includes('/') ?
    { type: 'doi', value: literatureLink } :
    { type: 'pubmed', value: literatureLink };
  const collection = await Collection.create({
    _organism: organism,
    _user: user,
    access: user ? 'private' : 'shared',
    description,
    genomes: genomeIds,
    locations: getLocations(genomes),
    organismId,
    organismName,
    literatureLink: parsedLiteratureLink,
    size,
    subtrees,
    title,
    token: Collection.generateToken(title),
    tree,
  });

  await GenomeCollection.bulkWrite(
    genomeIds.map((_genome) => ({
      updateOne: {
        filter: { _genome },
        update: { $addToSet: { collections: collection._id } },
        upsert: true,
      },
    })),
  );

  return collection;
}

function submitCollection(collection) {
  const { _id, token, organismId, _user, tree, subtree } = collection;
  if (!tree && !subtree) return Promise.resolve(collection);
  return request('collection', 'submit-trees', {
    organismId,
    collectionId: _id,
    clientId: token,
    userId: _user,
  })
    .then(() => collection);
}

module.exports = function (message) {
  return Promise.resolve(message)
    .then(validate)
    .then(getGenomes)
    .then((genomes) => createCollection(genomes, message))
    .then(submitCollection)
    .then(({ token }) => ({ token }));
};
