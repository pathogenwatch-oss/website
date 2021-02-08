/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */
/* eslint max-params: 0 */

const es = require("event-stream");
const BSON = require("bson");

const Analysis = require("models/analysis");
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

function createAlignmentDocumentsStream(genomes, versions, organismId) {
  const cores = Analysis.find({
    fileId: { $in: genomes.map((x) => x.fileId) },
    task: "alignment",
    version: versions.alignment,
    organismId,
  }, {
    fileId: 1,
    "results.sam": 1,
  }).sort({ fileId: 1 }).lean().cursor();

  const reformatCores = es.through(function (core) {
    const { fileId, results } = core;
    const genome = {
      fileId,
      analysis: { alignment: results },
    };
    this.emit("data", genome);
  });

  const toRaw = es.map((doc, cb) => cb(null, bson.serialize(doc)));
  return cores.pipe(reformatCores).pipe(toRaw);
}

function attachInputStream(container, versions, genomes, organismId) {
  const docsStream = createAlignmentDocumentsStream(genomes, versions, organismId);

  const treeInput = require("fs").createWriteStream("tree-input-3.bson");
  treeInput.write(
    bson.serialize({ genomes }),
    docsStream.pipe(treeInput),
  );

  // container.stdin.write(
  //   bson.serialize({ genomes }),
  //   docsStream.pipe(container.stdin),
  // );
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

    attachInputStream(container, versions, genomes, metadata.organismId);
  });
}

module.exports = runTask;
