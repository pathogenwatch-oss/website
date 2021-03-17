/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */
/* eslint max-params: 0 */

const BSON = require("bson");
const { Readable } = require('stream');

const store = require('utils/object-store');
const Collection = require("../../models/collection");
const Genome = require("../../models/genome");

const runCoreBasedTree = require("./run-core-based-tree");
const { createContainer, handleContainerOutput, handleContainerExit } = runCoreBasedTree;

const bson = new BSON();

async function getGenomes(task, metadata) {
  const { genomes } = await Collection.findOne(
    { _id: metadata.collectionId },
    { genomes: 1 },
  )
    .lean();

  const query = { _id: { $in: genomes } };

  const docs = await Genome
    .find(query, { fileId: 1, name: 1 }, { sort: { fileId: 1 } })
    .lean();

  const ids = new Set(genomes.map(_ => _.toString()));

  return docs.map(({ _id, fileId, name }) => ({
    _id,
    fileId,
    name,
    population: !ids.has(_id.toString()),
  }));
}

async function createInputStream(genomes, versions, organismId) {
  const fileIds = genomes.map(_ => _.fileId);
  fileIds.sort();

  const analysisKeys = fileIds.map(fileId => store.analysisKey('alignment', versions.alignment, fileId))
  async function* gen() {
    yield bson.serialize({ genomes })
    for await (const value of store.iterGet(analysisKeys)) {
      const core = JSON.parse(value);
      if (core.organismId !== organismId) continue;
      const { fileId, results } = core;
      const genome = {
        fileId,
        analysis: { alignment: results },
      };
      yield bson.serialize(genome)
    }
  }

  return Readable.from(gen());
}

async function runTask(spec, metadata, timeout) {
  const genomes = await getGenomes(spec.task, metadata);

  const { task, version, requires: taskRequires = [] } = spec;
  const alignmentVersion = taskRequires.find((x) => x.task === "alignment").version;
  const versions = { tree: version, alignment: alignmentVersion };

  return new Promise((resolve, reject) => {
    const container = createContainer(spec, metadata, timeout);
    handleContainerOutput(container, task, versions, metadata, genomes, resolve, reject);
    handleContainerExit(container, task, versions, metadata, reject);
    createInputStream(genomes, versions, organismId).pipe(container.stdin)
  });
}

module.exports = runTask;
