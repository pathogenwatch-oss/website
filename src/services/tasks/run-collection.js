/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */

const docker = require('docker-run');
const es = require('event-stream');
const BSON = require('bson');

const bson = new BSON();

const Analysis = require('models/analysis');
const Collection = require('../../models/collection');
const ScoreCache = require('../../models/scoreCache');

const { getImageName } = require('manifest.js');

const LOGGER = require('utils/logging').createLogger('runner');

function runTask(task, version, requires, collectionId, metadata) {
  const { subtree, organismId } = metadata;
  // const query = subtree ?
  //   { 'analysis.core.fp': subtree, $or: [ { _collection: collectionId }, { published: true } ] } :
  //   { _collection: collectionId };
  return Collection.findOne(
      { _id: collectionId },
      { 'genomes._id': 1, 'genomes.fileId': 1 },
      { sort: { 'genomes.fileId': 1 } }
    )
    .lean()
    .then(({ genomes }) => new Promise((resolve, reject) => {
      const container = docker(getImageName(task, version), {
        env: {
          WGSA_ORGANISM_TAXID: organismId,
          WGSA_COLLECTION_ID: collectionId,
        },
        remove: false,
      });

      const fileIds = genomes.map(_ => _.fileId);

      container.stdin.write(bson.serialize({ ids: genomes.map(_ => _._id.toString()) }));

      const scoresStream = ScoreCache.collection.find(
        { fileId: { $in: fileIds } },
        genomes.reduce((projection, { fileId }) => {
          projection[`scores.${fileId}`] = 1;
          return projection;
        }, { fileId: 1 }),
        { raw: true, sort: { fileId: 1 } }
      );

      const genomesStream = Analysis.collection.find(
        { fileId: { $in: fileIds }, $or: requires },
        { 'results.varianceData': 1, fileId: 1 },
        { raw: true, sort: { fileId: 1 } }
      );

      genomesStream.pause();
      scoresStream.on('end', () => genomesStream.resume());

      container.stdout
        .pipe(es.split())
        .on('data', (data) => {
          try {
            const doc = JSON.parse(data);
            if (doc.fileId && doc.scores) {
              const update = {};
              for (const key of Object.keys(doc.scores)) {
                update[`scores.${key}`] = doc.scores[key];
              }
              ScoreCache.update({ fileId: doc.fileId, version }, update, { upsert: true }).exec();
            } else {
              resolve(doc);
            }
          } catch (e) {
            reject(e);
          }
        });

      es.merge(
        scoresStream,
        genomesStream
      )
      .pipe(container.stdin);
      // .pipe(require('fs').createWriteStream('input.bson'));

      container.on('exit', (exitCode) => {
        LOGGER.info('exit', exitCode);
        if (exitCode !== 0) {
          container.stderr.setEncoding('utf8');
          reject(new Error(container.stderr.read()));
        }
      });
      container.on('spawn', (containerId) => {
        LOGGER.info('spawn', containerId, 'running task', task, 'for collection', collectionId);
      });
      container.on('error', reject);
    }));
}

module.exports = function handleMessage({ task, version, requires, collectionId, metadata }) {
  return runTask(task, version, requires, collectionId, metadata);
};
