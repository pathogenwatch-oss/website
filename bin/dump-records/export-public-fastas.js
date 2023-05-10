/* eslint-disable no-console */
const mongoConnection = require("utils/mongoConnection");
const Genome = require('models/genome');
const store = require('utils/fasta-store');
const argv = require('named-argv');
const mapLimit = require('promise-map-limit');
const fs = require("fs");

async function extractOrganisms() {
  const query = { public: true };
  const organismIds = await Genome.distinct('analysis.speciator.organismId', query);
  const projection = {
    _id: 0,
    'analysis.speciator.organismId': 1,
    'analysis.speciator.speciesId': 1,
    'analysis.speciator.genusId': 1,
    'analysis.speciator.superkingdomId': 1,
    'analysis.speciator.organismName': 1,
  };
  const organisms = [];
  for (const organismId of organismIds) {
    const organismQuery = { ...query, 'analysis.speciator.organismId': organismId };
    const organism = await Genome.findOne(organismQuery, projection).lean();
    organisms.push({
      organismId: organism.analysis.speciator.organismId,
      speciesId: organism.analysis.speciator.speciesId,
      genusId: organism.analysis.speciator.genusId,
      superkingdomId: organism.analysis.speciator.superkingdomId,
      organismName: organism.analysis.speciator.organismName,
    });
  }
  return organisms;
}

async function fetchFileIds(organismId) {
  const fileIds = await Genome.find(
    { public: true, 'analysis.speciator.organismId': organismId },
    { _id: 0, fileId: 1, name: 1 }
  ).lean();
  return fileIds;
}

async function exportSpeciesFASTA({ organismId, organismName }, force, dryrun) {
  const filename = `${organismName}__fastas.zip`;

  if (!force) {
    // Check if the FASTA file exists
    try {
      if (fs.existsSync(filename)) {
        console.log(`FASTA ${filename} already exists.`);
        return; // File exists
      }
    } catch (e) {
      console.log(`Creating FASTA ${filename}.`);
    }
  }

  const files = await fetchFileIds(organismId);

  const cleanFiles = files.map(({ fileId, name }) => {
    return { fileId, name: `${name.replace('/', '|')}.fasta` };
  });
  console.log(`Found ${files.length} FASTAs for ${organismName}`);
  if (dryrun) {
    console.log(`Dry run: would have downloaded ${files.length} FASTAs for ${organismName}`);
    return;
  }
  const writeStream = fs.createWriteStream(filename, { flags: 'w' });

  const writeFile = new Promise((resolve, reject) => {
    writeStream.on('error', (error) => {
      console.log(`An error occurred while writing to the file. Error: ${error.message}`);
      process.exit(1);
    });
    writeStream.on('finish', resolve);
  });

  const archiveStream = store.archive(cleanFiles);

  const pipeline = archiveStream.pipe(writeStream);

  pipeline.on('close', () => {
    console.log('upload successful');
  });
  pipeline.on('error', (err) => {
    console.log('upload failed', err.message);
  });
  await writeFile;
  writeStream.end();
}

async function main() {
  await mongoConnection.connect();
  const { force = false, filter = "", cpu = 3, dryrun = false } = argv.opts;
  const filterArr = filter !== "" ? filter.split(',') : [];
  const organisms = await extractOrganisms();
  await mapLimit(organisms, cpu, async (organism) => {
    if (filterArr.length === 0 ||
      filterArr.includes(organism.organismId) ||
      filterArr.includes(organism.speciesId) ||
      filterArr.includes(organism.genusId) ||
      filterArr.includes(organism.superkingdomId)) {
      console.log(organism.organismName);
      await exportSpeciesFASTA(organism, force, dryrun);
    }
  });
}

main()
  .then(() => {
    console.log('Run `s3cmd sync --delete-removed --acl-public . s3://pathogenwatch-public/` to upload the resulting files to S3');
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
