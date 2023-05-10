const mongoConnection = require("utils/mongoConnection");
const CgmlstProfile = require('models/cgmlstprofile');
const Genome = require('models/genome');

async function main() {
  mongoConnection.connect();
  await CgmlstProfile.deleteMany({});
  const query = {
    'analysis.cgmlst.code': { '$exists': true },
  };
  const projection = { 'analysis.cgmlst': 1, fileId: 1 };
  const batch = [];
  let counter = 0;
  const genomes = Genome.collection.find(query, projection);
  while (await genomes.hasNext()) {
    const genome = await genomes.next();
    // for await (const genome of Genome.find(query, projection)) {
    const { st, code } = genome.analysis.cgmlst;
    const fileId = genome.fileId;
    const matches = code.split('_');
    batch.push({
      'updateOne': {
        'filter': { fileId },
        'update': {
          fileId,
          st,
          schemeSize: matches.length,
          matches,
        },
        'upsert': true,
      },
    });
    if (batch.length === 10000) {
      counter += 1;
      console.log(`Writing records ${(counter - 1) * 10000}-${counter * 10000}`);
      await CgmlstProfile.bulkWrite(batch);
      batch.length = 0;
    }
    // await CgmlstProfile.upsertProfile(genome.analysis);
  }
  if (batch.length > 0) {
    console.log(`Writing final ${batch.length} records`);
    await CgmlstProfile.bulkWrite(batch);
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
