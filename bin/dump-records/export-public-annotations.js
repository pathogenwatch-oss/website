/* eslint-disable no-console */
const { getTasksByOrganism } = require("manifest");
const Genome = require('models/genome');
const csv = require('csv');
const mongoConnection = require("utils/mongoConnection");
const Readable = require("event-stream");
const { transformer: metadataTransformer, standardColumns } = require("routes/download/utils/metadata");
const zlib = require('zlib');
const { labels: seroLabels, labels } = require("routes/download/utils/serotype");
const argv = require("named-argv");
const { objectStore: config } = require("configuration");
const aws = require("aws-sdk");
const http = require("http");
const https = require("https");
const { PassThrough } = require("stream");

const transformers = {
  'core-summary': require('routes/download/utils/core-summary').transformer,
  genotyphi: require('routes/download/utils//genotyphi').transformer,
  inctyper: require('routes/download/utils//inctyper').transformer,
  kaptive: require('routes/download/utils//kaptive').transformer,
  kleborate: require('routes/download/utils//kleborate').transformer,
  'klebsiella-lincodes': require('routes/download/utils//klebsiella-lincodes').transformer,
  metrics: require('routes/download/utils//metrics').transformer,
  mlst: require('routes/download/utils/mlst').transformer,
  ngmast: require('routes/download/utils/ngmast').transformer,
  paarsnp: require('routes/download/utils/paarsnp').transformer,
  'paarsnp-snps-genes': require('routes/download/utils/paarsnp-snps-genes').transformer,
  pangolin: require('routes/download/utils/pangolin').transformer,
  poppunk2: require('routes/download/utils/poppunk2').transformer,
  'sarscov2-variants': require('routes/download/utils/sarscov2-variants').transformer,
  serotype: require('routes/download/utils/serotype').transformer,
  speciator: require('routes/download/utils//speciator').transformer,
  'spn-pbp-amr': require('routes/download/utils/spn-pbp-amr').transformer,
  vista: require('routes/download/utils/vista-full').transformer,
};

const endpoint = config.endpoint ? new aws.Endpoint(config.endpoint) : undefined;

const s3 = new aws.S3({
  endpoint,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  httpOptions: {
    // agent: new http.Agent({ keepAlive: true }),
    agent: endpoint.protocol === 'http:' ? new http.Agent({ keepAlive: true }) : new https.Agent({ keepAlive: true }),
  },
  maxRetries: 1,
  ...config.extraS3Params,
});

function selectTransformer(task, { speciesId }) {
  if ([ 'mlst', 'mlst2' ].includes(task.task)) {
    return transformers.mlst(task.task);
  } else if (task.task === 'serotype') {
    return transformers.serotype(labels[speciesId] || labels.general);
  }
  return transformers[task.task];
}

async function writeDataFiles({ organismId, speciesId, genusId, superkingdomId, organismName }) {
  const filenameBase = organismName.replace('/', '|');
  const genomes = await Genome.find({
    public: true,
    'analysis.speciator.organismId': organismId,
  }, { analysis: 1, name: 1, fileId: 1 }).lean();
  console.log(`Retrieved ${genomes.length} genomes.`);

  const taxQuery = { organismId, speciesId, genusId, superkingdomId };
  const tasks = getTasksByOrganism(taxQuery);

  for (const task of Object.values(tasks)) {
    console.log(`Processing task ${task.task}.`);
    if (!(task.task in transformers)) continue;
    const transformer = selectTransformer(task, taxQuery);

    const uploadStream = ({ Bucket, Key }) => {
      const pass = new PassThrough();
      return {
        writeStream: pass,
        promise: s3.upload({ Bucket, Key, Body: pass }).promise(),
      };
    };
    const { writeStream, promise } = uploadStream({
      Bucket: 'pathogenwatch-public',
      Key: `${filenameBase}__${task.task}.csv.gz`,
    });
    // const writableStream = fs.createWriteStream(`${filenameBase}__${task.task}.csv.gz`, { flags: 'w' });
    const gzipStream = zlib.createGzip();

    // const writeFile = new Promise((resolve, reject) => {
    //   writableStream.on('error', (error) => {
    //     console.log(`An error occurred while writing to the file. Error: ${error.message}`);
    //     process.exit(1);
    //   });
    //   writableStream.on('finish', resolve);
    Readable.from(genomes)
      .pipe(csv.transform(transformer))
      .pipe(csv.stringify({ header: true, quotedString: true }))
      .pipe(gzipStream)
      .pipe(writeStream);

    await promise;
    writeStream.end();
    // await writeFile;
    // writableStream.end();
  }
  // Finally, write the metadata file.
  const query = {
    _id: { $in: genomes.map((genome) => genome._id) },
  };

  const projection = {
    country: 1,
    day: 1,
    latitude: 1,
    longitude: 1,
    month: 1,
    name: 1,
    literatureLink: 1,
    uploadedAt: 1,
    userDefined: 1,
    year: 1,
  };

  // retrieve all user-defined columns
  const result = await Genome.aggregate([
    { $match: query },
    { $project: { userDefined: { $objectToArray: '$userDefined' } } },
    { $unwind: { path: '$userDefined', preserveNullAndEmptyArrays: true } },
    { $group: { _id: null, columns: { $addToSet: '$userDefined.k' } } },
  ]);

  const columns = [ ...standardColumns, ...result[0].columns ];

  const uploadStream = ({ Bucket, Key }) => {
    const pass = new PassThrough();
    return {
      writeStream: pass,
      promise: s3.upload({ Bucket, Key, Body: pass, ACL: 'public-read' }).promise(),
    };
  };
  const { writeStream, promise } = uploadStream({
    Bucket: 'pathogenwatch-public',
    Key: `${filenameBase}__metadata.csv.gz`,
  });

  const gzipStream = zlib.createGzip();
  Genome.find(query, projection, { sort: { name: 1 } })
    .cursor()
    .pipe(csv.transform(metadataTransformer))
    .pipe(csv.stringify({ header: true, quotedString: true, columns }))
    .pipe(gzipStream)
    .pipe(writeStream);

  await promise;
  writeStream.end();
}

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

async function main() {
  const { force = false, filter = "" } = argv.opts;
  const filterArr = filter !== "" ? filter.split(',') : [];

  await mongoConnection.connect();
  console.log(`Connected to the database.`);
  const organisms = await extractOrganisms(force);
  for (const organism of organisms) {
    if (filterArr.length === 0 || filterArr.includes(organism.organismId) || filterArr.includes(organism.speciesId) || filterArr.includes(organism.genusId)) {
      console.log(`Writing data for ${organism.organismId}`);
      await writeDataFiles(organism);
    }
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
