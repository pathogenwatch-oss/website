const { DEFAULT_TIMEOUT } = require("../bus");
const Collection = require("../../models/collection");

const runCoreBasedTree = require("./run-core-based-tree");
const runAlignmentBasedTree = require("./run-alignment-based-tree");

async function getGenomes(metadata) {
  const collection = await Collection.findOne(
    { _id: metadata.collectionId },
    { genomes: 1 },
  )
    .lean();
  return collection.genomes;
}

async function runTask(spec, metadata, timeout) {
  const genomes = await getGenomes(metadata);
  if (genomes.length <= 1) {
    throw new Error("Not enough genomes to make a tree");
  }
  else if (genomes.length === 2) {
    return {
      newick: `(${genomes[0]._id}:0.5,${genomes[1]._id}:0.5);`,
      size: 2,
      populationSize: genomes.filter(_ => _.population).length,
      name: metadata.name,
    };
  }

  if (spec.requires.find((x) => x.task === "core")) {
    return runCoreBasedTree(spec, metadata, timeout);
  }

  if (spec.requires.find((x) => x.task === "alignment")) {
    return runAlignmentBasedTree(spec, metadata, timeout);
  }

  throw new Error("Unknown tree task.");
}

module.exports = function handleMessage({ spec, metadata, timeout$: timeout = DEFAULT_TIMEOUT }) {
  return runTask(spec, metadata, timeout);
};
