// const promisify = require('promisify-node');
const argv = require('named-argv');
const request = require('request');
const jszip = require('jszip');

const services = require('services');
const mongoConnection = require('utils/mongoConnection');

const storeGenomes = require('./utils/store-genomes');

const {
  organismId,
  collectionId,
} = argv.opts;

console.log({ organismId, collectionId });

if (!organismId || !collectionId) {
  console.log('Missing arguments');
  process.exit(1);
}

function getCollectionUrl() {
  return `http://www.wgsa.net/api/species/${organismId}/collection/${collectionId}`;
}

function getJson(url) {
  console.warn('GET', url)
  return new Promise((resolve, reject) =>
    request(url, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(JSON.parse(body));
    }));
}

function postJson(uri, json) {
  console.warn('POST', uri, json);
  return new Promise((resolve, reject) =>
    request({ uri, json, method: 'POST' }, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(body);
    }));
}

function getCollectionJson(url) {
  return getJson(url);
}

function parseGenomes({ assemblies }) {
  return Object.keys(assemblies).map(assemblyId => {
    const { assemblyName, pmid, date = {}, position = {}, userDefined } = assemblies[assemblyId].metadata;
    const { year, month, day } = date;
    const { latitude, longitude } = position;
    return {
      name: assemblyName,
      pmid,
      year, month, day,
      latitude, longitude,
      userDefined,
      assemblyId,
    };
  });
}

function fetchAndUnzip(uri, filename) {
  console.warn('UNZIP', uri, filename);
  return new Promise((resolve, reject) =>
    request({ uri, encoding: null }, (error, response, body) => {
      if (error) return reject(error);
      resolve(
        jszip.loadAsync(body)
          .then(zip => zip.file(filename).nodeStream())
      );
    })
  );
}

function getGenomeFile({ assemblyId, name }) {
  return (
    postJson('http://www.wgsa.net/api/species/1280/download/type/assembly/format/fasta', { idList: [ assemblyId ] })
      .then(response => Object.keys(response)[0])
      .then(id => fetchAndUnzip(
        `http://www.wgsa.net/api/species/1280/download/file/${id}?prettyFileName=file`,
        `${name}.fa`
      ))
  );
}

function createCollection(genomes) {
  return services.request('collection', 'create', { organismId, genomeIds: genomes.map(_ => _.id) });
}

mongoConnection.connect()
  .then(getCollectionUrl)
  .then(getCollectionJson)
  .then(parseGenomes)
  .then(genomes => storeGenomes(genomes, getGenomeFile))
  .then(createCollection)
  .then(console.log)
  .then(() => setTimeout(() => process.exit(0), 1000 * 60))
  .catch(console.error)
    .then(() => process.exit(1));
