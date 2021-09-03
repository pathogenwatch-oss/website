const { request } = require('services/bus');

const runCoreBasedTree = require("./run-core-based-tree");
const runAlignmentBasedTree = require("./run-alignment-based-tree");

async function runTask(spec, metadata) {
  const { requires = [] } = spec;

  if (requires.find((x) => x.task === "core")) {
    return runCoreBasedTree(spec, metadata);
  }

  if (requires.find((x) => x.task === "alignment")) {
    return runAlignmentBasedTree(spec, metadata);
  }

  throw new Error("Unknown tree task.");
}

module.exports = async function handleMessage({ spec, metadata }) {
  const result = await runTask(spec, metadata);
  await request('collection', 'add-analysis', { spec, metadata, result });
};
