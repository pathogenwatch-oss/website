const { DEFAULT_TIMEOUT } = require("../bus");
const Collection = require("../../models/collection");

const runCoreBasedTree = require("./run-core-based-tree");
const runAlignmentBasedTree = require("./run-alignment-based-tree");

async function runTask(spec, metadata, timeout) {

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
