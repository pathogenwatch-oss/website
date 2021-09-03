const BSON = require('bson');
const { createHash } = require("crypto");

const bson = new BSON();

module.exports.b64encode = function (value) {
  return Buffer.from(value).toString('base64');
};

function hashDocument(data) {
  function sortObjects(key, value) {
    if (value === null) return value;
    if (typeof value === 'object') {
      const resp = {};
      const keys = Object.keys(value).filter((_) => value.hasOwnProperty(_));
      keys.sort();
      for (const k of keys) {
        resp[k] = value[k];
      }
      return resp;
    }
    return value;
  }

  const s = JSON.stringify(data, sortObjects, 0);
  return createHash('sha1').update(s).digest().slice(0, 8);
}
module.exports.hashDocument = hashDocument;

module.exports.hashGenome = function (genome) {
  const { analysis = {}, ...data } = genome;
  data.analysis = {};
  for (const task of Object.keys(analysis)) {
    const { organismId, __v } = analysis[task];
    data.analysis[task] = { __v };
    if (organismId !== undefined) data.analysis[task].organismId = organismId;
  }

  return hashDocument(data);
};

module.exports.serializeBSON = function (doc) {
  return bson.serialize(doc).toString('base64');
};

module.exports.deserializeBSON = function (docBytes) {
  return bson.deserialize(Buffer.from(docBytes, 'base64'));
};
