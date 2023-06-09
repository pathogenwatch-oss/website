/* eslint-disable max-len,no-console */
const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');

const { request } = require('services');
const Collection = require('models/collection');
const Genome = require('models/genome');
const { getCollectionTask } = require("manifest");

const { query = { 'tree.versions': { $exists: false } } } = argv.opts;

async function run() {
  const collections = await Collection.find(
    JSON.parse(query),
    { token: 1, organismId: 1, tree: 1, subtrees: 1, _user: 1, genomes: 1 },
    { lean: true }
  );

  for (const collection of collections) {
    const spec = getCollectionTask(collection.organismId, 'subtree');
    if (!!spec) {
      // Delete the old trees and create the new placeholders
      const genomes = await Genome.find({ _id: { $in: collection.genomes } }, { 'analysis.core.fp': 1 }).lean();
      const refs = new Set();
      for (const { analysis = {} } of genomes) {
        if (analysis.core && analysis.core.fp && analysis.core.fp.reference) {
          refs.add(analysis.core.fp.reference);
        }
      }

      const newSubtrees = await Promise.all(
        Array.from(refs).map(async (name) => {
          const count = await Genome.count({
            $or: [ { population: true }, { _id: { $in: collection.genomes } } ],
            'analysis.core.fp.reference': name,
            'analysis.speciator.organismId': collection.organismId,
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
      await Collection.updateOne({ _id: collection._id }, { $set: { subtrees: newSubtrees } });
    }
    await request('collection', 'submit-trees', {
      organismId: collection.organismId,
      collectionId: collection._id,
      clientId: collection.token,
      userId: collection._user.toString(),
    });
    console.log('Done', collections.indexOf(collection) + 1, 'of', collections.length);
  }
}

(async function () {
  try {
    await mongoConnection.connect();
    await run();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}());
