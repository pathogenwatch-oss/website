/* eslint-disable max-len,no-console */
const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');

const { request } = require('services');
const Collection = require('models/collection');

const { query = { 'tree.versions': { $exists: false } }, subtrees = false } = argv.opts;

async function run() {
  const collections = await Collection.find(
    JSON.parse(query),
    { token: 1, organismId: 1, tree: 1, subtrees: 1 },
    { lean: true }
  );

  for (const collection of collections) {
    await request('collection', 'submit-trees', {
      organismId: collection.organismId,
      collectionId: collection._id,
      clientId: collection.token,
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
