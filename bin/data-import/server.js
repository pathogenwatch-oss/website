const auth = require("basic-auth");
const express = require("express");
const { randomBytes, timingSafeEqual } = require("crypto");
const fs = require('fs');
const https = require('https');
const path = require('path');
const morgan = require("morgan");

const mongoConnection = require('utils/mongoConnection');
const Genome = require('models/genome');
const objectStore = require('utils/object-store');

const { hashGenome, deserializeGenome } = require('./common.js');

function newPass() {
  return randomBytes(32)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const { name = 'user', pass = newPass(), baseUrl } = require("./env.json");

const nameBytes = Buffer.from(name, 0, 200);
const passBytes = Buffer.from(pass, 0, 200);

function authenticate(res) {
  res.set('WWW-Authenticate', 'Basic realm="Login", charset="UTF-8"');
  return res
    .status(401)
    .send('Not Authorised');
}

function basicAuth(req, res, next) {
  const user = auth(req);
  if (user === undefined) {
    return authenticate(res);
  }

  let authorised = true;
  authorised = (name.length === user.name.length) && timingSafeEqual(nameBytes, Buffer.from(user.name, 0, 200)) && authorised;
  authorised = (pass.length === user.pass.length) && timingSafeEqual(passBytes, Buffer.from(user.pass, 0, 200)) && authorised;

  if (authorised) return next();
  return authenticate(res);
}

function asyncWrapper(handler) {
  return function (req, res, next) {
    handler(req, res, next).catch(next);
  };
}

const storeCache = new Set();
async function checkStore(keys) {
  const missing = {};
  for (const key of keys) {
    if (storeCache.has(key)) continue;
    const prefix = key.replace(/[^/]+$/, '');
    missing[prefix] = missing[prefix] || new Set();
    missing[prefix].add(key);
  }

  let output = [];
  for (const prefix of Object.keys(missing)) {
    for await (const { Key: key } of objectStore.list(prefix)) {
      storeCache.add(key);
      missing[prefix].delete(key);
    }
    output = [...output, ...missing[prefix]];
  }
  return output;
}

const app = express();
app.use(
  morgan("dev"),
  express.json({ limit: "20mb" }),
  // bodyParser.raw({ limit: "40mb" }),
  basicAuth
);

app.get('/status', (req, res) => {
  return res.status(200).send({ ok: true, cache: storeCache.size });
});

app.post('/genome/status', asyncWrapper(async (req, res, next) => {
  const offer = req.body.genomes;
  const genomeIds = Object.keys(offer);
  const missing = new Set(genomeIds);
  if (genomeIds.length > 1000) return res.status(400).send(`Expected fewer than 1000 genome, got ${genomeIds.length}`);
  const genomes = Genome.find({ _id: { $in: genomeIds } }).lean().cursor();
  for await (const genome of genomes) {
    const genomeId = genome._id.toString();
    const digest = hashGenome(genome).toString('base64');
    if (offer[genomeId] === digest) missing.delete(genomeId);
    missing.delete(genomeId);
  }
  return res.status(200).send({ count: missing.size, genomes: [ ...missing ] });
}));

app.post('/genome/:genomeId', asyncWrapper(async (req, res, next) => {
  const data = req.body;
  const genome = deserializeGenome(data.genome);
  await Genome.collection.replaceOne({ _id: genome._id }, genome, { upsert: true });
  return res.send({ genomeId: genome._id });
}));

app.post('/analysis/status', asyncWrapper(async (req, res, next) => {
  const offer = req.body.analyses;
  if (offer.length > 10000) return res.status(400).send(`Expected fewer than 10000 analyses, got ${offer.length}`);
  const keys = new Set();
  for (const { task, version, organismId, fileId } of offer) {
    keys.add(objectStore.analysisKey(task, version, fileId, organismId));
  }
  const missing = new Set(await checkStore(keys));
  const output = { analyses: [] };
  for (const params of offer) {
    const { task, version, organismId, fileId } = params;
    const key = objectStore.analysisKey(task, version, fileId, organismId);
    if (missing.has(key)) {
      output.analyses.push(params);
      missing.delete(key);
    }
  }
  return res.status(200).send(output);
}));

app.post('/analysis/:task/:version/:fileId/:organismId', asyncWrapper(async (req, res, next) => {
  const data = req.body;
  const { task, version, fileId, organismId } = req.params;
  await objectStore.putAnalysis(task, version, fileId, organismId, data);
  storeCache.add(objectStore.analysisKey(task, version, fileId, organismId));
  return res.send({ ok: true });
}));

app.post('/fasta/status', asyncWrapper(async (req, res, next) => {
  const fileIds = req.body.fileIds;
  if (fileIds.length > 1000) return res.status(400).send(`Expected fewer than 1000 assemblies, got ${fileIds.length}`);
  const keys = new Set();
  for (const fileId of fileIds) {
    keys.add(objectStore.fastaKey(fileId));
  }
  const missing = new Set(await checkStore(keys));
  const output = { fileIds: [] };
  for (const fileId of fileIds) {
    const key = objectStore.fastaKey(fileId);
    if (missing.has(key)) {
      output.fileIds.push(fileId);
      missing.delete(key);
    }
  }
  return res.status(200).send(output);
}));

app.post('/fasta/:fileId', asyncWrapper(async (req, res) => {
  await objectStore.putFasta(req.params.fileId, req, { compress: false });
  storeCache.add(objectStore.fastaKey(req.params.fileId));
  res.send({ ok: true });
}));

async function main() {
  const port = 443;
  await mongoConnection.connect();
  https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'certs', 'privkey.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'fullchain.pem')),
    ca: fs.readFileSync(path.join(__dirname, 'certs', 'chain.pem')),
  }, app).listen(port, "0.0.0.0", () => {
    console.log(`Listening on port ${port}`);
    console.log(`Credentials are '${name}:${pass}'`);
  });
}

if (require.main === module) {
  main();
}
