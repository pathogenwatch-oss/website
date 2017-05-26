const LOGGER = require('utils/logging').createLogger('migrator');

// const promisify = require('promisify-node');
const argv = require('named-argv');
const request = require('request');
const jszip = require('jszip');

const services = require('services');
const Collection = require('models/collection');

const storeGenomes = require('../../utils/store-genomes');

const {
  organismId,
  collectionId,
  apiUrl = 'http://www.wgsa.net/api',
} = argv.opts;

console.log({ organismId, collectionId, apiUrl });

if (!organismId || !collectionId) {
  LOGGER.error('Missing arguments');
  process.exit(1);
}

function checkCollection() {
  return (
    Collection.findOne({ $or: [ { uuid: collectionId }, { alias: collectionId } ] })
      .then(doc => {
        if (doc) {
          console.error('Collection exists in mongo:', doc.uuid);
          process.exit(1);
        }
      })
  );
}

function getCollectionUrl() {
  return `${apiUrl}/species/${organismId}/collection/${collectionId}`;
}

function getDownloadUrl() {
  return `${apiUrl}/species/${organismId}/download/type/assembly/format/fasta`;
}

function getGenomeFileUrl(id) {
  return `${apiUrl}/species/${organismId}/download/file/${id}?prettyFileName=file`;
}

function getJson(url) {
  LOGGER.info('GET', url);
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
  LOGGER.info('POST', uri, json);
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
      uuid: assemblyId,
    };
  });
}

function fetchAndUnzip(uri, filename) {
  LOGGER.info('UNZIP', uri, filename);
  return new Promise((resolve, reject) =>
    request({ uri, encoding: null }, (error, response, body) => {
      if (error) return reject(error);
      return resolve(
        jszip.loadAsync(body)
          .then(zip => zip.file(filename).nodeStream())
      );
    })
  );
}

function getGenomeFile({ uuid, name }) {
  return (
    postJson(getDownloadUrl(), { idList: [ uuid ] })
      .then(response => Object.keys(response)[0])
      .then(id => fetchAndUnzip(getGenomeFileUrl(id), `${name}.fa`))
  );
}

function createCollection(genomeIds) {
  return services.request('collection', 'create', { organismId, genomeIds });
}

module.exports = function () {
  return checkCollection()
    .then(getCollectionUrl)
    .then(getCollectionJson)
    .then(parseGenomes)
    .then(genomes => storeGenomes(genomes, getGenomeFile, {}, LOGGER))
    .then(_ => _.map(([ , genome ]) => genome.id))
    .then(createCollection)
    .then(result => {
      LOGGER.info(result);
      Collection.alias(result.uuid, collectionId)
        .then(() => setTimeout(() => process.exit(0), 1000 * 5));
    })
    .catch(error => {
      LOGGER.error(error);
      process.exit(1);
    });
};
