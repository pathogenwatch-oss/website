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
      user: migratee._user,
    };
    try {
      const { token } = await request('collection', 'create', message);

      const slugSections = token.split('-').slice(1);
      slugSections.unshift(migratee.uuid);

      await Collection.update(
        { token }, {
          token: slugSections.join('-'),
          access: migratee.public ? 'public' : 'shared',
          showcase: migratee.showcase,
          alias: migratee.uuid,
          createdAt: migratee.createdAt,
        }
      );
      await migratee.remove();
    } catch (e) { console.log(e.message); }
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
