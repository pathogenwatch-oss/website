const { request } = require('services/bus');
const { DEFAULT_TIMEOUT } = require("../bus");

const runCoreBasedTree = require("./run-core-based-tree");
const runAlignmentBasedTree = require("./run-alignment-based-tree");

async function runTask(spec, metadata, timeout) {
  const { requires = [] } = spec;

  if (requires.find((x) => x.task === "core")) {
    return runCoreBasedTree(spec, metadata, timeout);
  }

  if (requires.find((x) => x.task === "alignment")) {
    return runAlignmentBasedTree(spec, metadata, timeout);
  }

  throw new Error("Unknown tree task.");
}

module.exports = async function handleMessage({ spec, metadata, timeout$: timeout = DEFAULT_TIMEOUT }) {
  const result = await runTask(spec, metadata, timeout);
  await request('collection', 'add-analysis', { spec, metadata, result });
};
