const argv = require("named-argv");
const mongoConnection = require("utils/mongoConnection");
const Genome = require('models/genome');
const Organism = require("models/organism");
const Collection = require("models/collection");
const User = require("models/user");
const GenomeCollection = require("models/genomecollection");
const { request } = require("services/bus");
const { getCollectionTask } = require("manifest");
const { enqueue } = require("models/queue");
const { ObjectId } = require('mongoose').Types;

function getSubtrees(organismId, genomes, genomeIds, user) {
  const spec = getCollectionTask(organismId, 'subtree', user);
  if (!spec) return null;

  const fps = new Set();
  for (const { analysis = {} } of genomes) {
    if (analysis.core && analysis.core.fp && analysis.core.fp.reference) {
      fps.add(analysis.core.fp.reference);
    }
  }

  return Promise.all(Array.from(fps).map(async (name) => {
    const count = await Genome.count({
      $or: [ { population: true }, { _id: { $in: genomeIds } } ],
      'analysis.core.fp.reference': name,
      'analysis.speciator.organismId': organismId,
    });
    if (count > 1) {
      return {
        name, status: 'PENDING',
      };
    }
    return null;
  })).then((subtrees) => subtrees.filter((_) => _ !== null));
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
  const parsedLiteratureLink = literatureLink.includes('/') ? { type: 'doi', value: literatureLink } : {
    type: 'pubmed', value: literatureLink,
  };
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

  await GenomeCollection.bulkWrite(genomeIds.map((_genome) => ({
    updateOne: {
      filter: { _genome }, update: { $addToSet: { collections: collection._id } }, upsert: true,
    },
  })),);

  return collection;
}

async function submitCollection(collection, user) {
  const { _id: collectionId, organismId, tree, subtree } = collection;
  const clientId = "cli";
  const precache = false;

  if (!tree && !subtree) return Promise.resolve(collection);
  const treeSpec = getCollectionTask(organismId, 'tree', user);
  const subtreeSpec = getCollectionTask(organismId, 'subtree', user);
  if (!treeSpec && !subtreeSpec) return Promise.resolve();
  await enqueue({
    spec: treeSpec,
    metadata: { organismId, collectionId, name: 'collection', clientId },
    precache,
  });
  if (subtreeSpec) {
    for (const subtree in getSubtrees(collectionId)) {
      await enqueue({
        spec: subtreeSpec,
        metadata: { organismId, collectionId, name: subtree.name, clientId },
        precache,
      });
    }
  }
  return collectionId;
}

async function main() {
  const {
    query = JSON.stringify({
      "binned": false, "public": true, "analysis.klebsiella-lincodes.Sublineage": "147",
    }), userId = "607993ea30c7f66f17cb73ed", organismId = "573", title = "SL147",
  } = argv.opts;
  if (query === "") {
    console.log("Expected: --query=[JSON format query on the genomes collection]");
    process.exit(1);
  }

  await mongoConnection.connect();
  const user = await User.findOne({ _id: ObjectId(userId) });
  const queryObj = { ...JSON.parse(query), ...{ "analysis.speciator.organismId": organismId } };
  // Fetch the list of genome Ids from the database
  // Also get the organismId and check it's the only one
  const genomes = await Genome.find(queryObj, { _id: 1 }).lean();
  const genomeIds = genomes.map(genome => genome._id.toString());
  const objectId = ObjectId(genomeIds[0]);
  const organismName = await Genome.findOne({ _id: objectId }).lean().then(
      genome => genome.analysis.speciator.organismName
  );
  const message = {
    organismId, organismName, title, description: "", literatureLink: "", user,
  };

  const genomeDetails = await Genome.find({ _id: { $in: genomeIds } }, {
    latitude: 1, longitude: 1, 'analysis.core.fp.reference': 1,
  })
    .lean();
  const collection = await createCollection(genomeDetails, message);
  await submitCollection(collection);
  console.log(JSON.stringify(collection));
  console.log(`Collection token: ${collection.token}`);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
