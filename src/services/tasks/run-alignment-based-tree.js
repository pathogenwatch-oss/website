/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint max-params: 0 */

const BSON = require("bson");

const bson = new BSON();
const { Readable } = require('stream');

const store = require('utils/object-store');
const Collection = require("models/collection");
const Genome = require("models/genome");

const runCoreBasedTree = require("./run-core-based-tree");

const { createContainer, handleContainerOutput, handleContainerExit } = runCoreBasedTree;

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

  const ids = new Set(genomes.map((_) => _.toString()));

  return docs.map(({ _id, fileId, name }) => ({
    _id,
    fileId,
    name,
    population: !ids.has(_id.toString()),
  }));
}

async function createInputStream(genomes, versions, organismId) {
  const fileIds = genomes.map((_) => _.fileId);
  fileIds.sort();

  const analysisKeys = fileIds.map((fileId) => store.analysisKey('alignment', versions.alignment, fileId, organismId));
  async function* gen() {
    yield bson.serialize({ genomes });
    for await (const value of store.iterGet(analysisKeys)) {
      const core = JSON.parse(value);
      const { fileId, results } = core;
      const genome = {
        fileId,
        analysis: { alignment: results },
      };
      yield bson.serialize(genome);
    }
  }

  return Readable.from(gen());
}

async function runTask(spec, metadata, timeout) {
  const { organismId } = metadata;
  const genomes = await getGenomes(spec.task, metadata);

  if (genomes.length <= 1) {
    throw new Error("Not enough genomes to make a tree");
  }
  else if (genomes.length === 2) {
    return {
      newick: `(${genomes[0]._id}:0.5,${genomes[1]._id}:0.5);`,
      size: 2,
      populationSize: genomes.filter((_) => _.population).length,
      name: metadata.name,
    };
  }

  const { task, version, requires: taskRequires = [] } = spec;
  const alignmentVersion = taskRequires.find((x) => x.task === "alignment").version;
  const versions = { tree: version, alignment: alignmentVersion };

  const container = await createContainer(spec, metadata, timeout);
  const whenContainerOutput = handleContainerOutput(container, task, versions, metadata, genomes);
  const whenContainerExit = handleContainerExit(container, task, versions, metadata);
  createInputStream(genomes, versions, organismId).pipe(container.stdin);

  const [output] = await Promise.all([
    whenContainerOutput,
    whenContainerExit,
  ]);
  return output;
}

module.exports = runTask;
