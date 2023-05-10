const slug = require('slug');

const store = require('utils/object-store');

module.exports = async function ({ scheme, version, userId, organismId }) {
  if (scheme === undefined) return undefined;
  const fullVersion = `${version}-${slug(scheme, { lower: true })}`;

  let value;
  if (userId) value = await store.getAnalysis('cgmlst-clustering', fullVersion, userId.toString(), organismId);
  if (value === undefined) value = await store.getAnalysis('cgmlst-clustering', fullVersion, 'public', organismId);
  if (value === undefined) return undefined;

  return JSON.parse(value);
};
