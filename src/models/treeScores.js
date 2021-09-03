const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  fileId: String,
  versions: {
    tree: String,
    core: String,
  },
  scores: Object,
  differences: Object,
});

schema.index({ fileId: 1, 'versions.core': 1, 'versions.tree': 1 });

schema.statics.getScores = async function (genomes, versions, type) {
  const fileIds = genomes.map((_) => _.fileId);
  fileIds.sort();

  const scoresByFileId = {};
  const fieldName = (type === 'score') ? 'scores' : 'differences';
  for (const fileId of fileIds) {
    scoresByFileId[fileId] = {};
  }

  const projection = fileIds.reduce((proj, fileId) => { proj[`${fieldName}.${fileId}`] = 1; return proj; }, { fileId: 1 });
  const docs = this.find(
    { fileId: { $in: fileIds }, 'versions.core': versions.core, 'versions.tree': versions.tree },
    projection
  ).cursor();

  for await (const doc of docs) {
    for (const fileId of fileIds) {
      if (doc[fieldName][fileId] !== undefined) scoresByFileId[doc.fileId][fileId] = doc[fieldName][fileId];
    }
  }
  return scoresByFileId;
};

schema.statics.addScores = function (versions, doc) {
  const update = {};
  const { scores = {}, differences = {} } = doc;
  for (const fileId of Object.keys(scores)) update[`scores.${fileId}`] = scores[fileId];
  for (const fileId of Object.keys(differences)) update[`differences.${fileId}`] = differences[fileId];

  if (Object.keys(update).length === 0) return undefined;

  return this.updateOne(
    { fileId: doc.fileId, 'versions.core': versions.core, 'versions.tree': versions.tree },
    { $set: update },
    { upsert: true }
  );
};

module.exports = mongoose.model('TreeScores', schema);
