const mongoConnection = require('utils/mongoConnection');

const { request } = require('services');
const Migratee = require('models/migratee');
const Collection = require('models/collection');

async function run() {
  const migratees = await Migratee.find({});
  for (const migratee of migratees) {
    const message = {
      genomeIds: migratee.genomes,
      title: migratee.title,
      description: migratee.description,
      pmid: migratee.pmid,
      organismId: migratee.organismId,
    };
    const token = await request('collection', 'create', message);
    await Collection.update(
      { token }, {
        access: migratee.public ? 'public' : 'shared',
        showcase: migratee.showcase,
        alias: migratee.uuid,
        published: migratee.published,
      }
    );
  }
}

(async function() {
  try {
    await mongoConnection.connect();
    await run();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}());
