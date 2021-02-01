module.exports = function (metadata) {
  const trimmedMetadata = {};
  for (const [ key, value ] of Object.entries(metadata).slice(0, 64)) {
    if (typeof value === 'string') {
      trimmedMetadata[key.trim().replace('.', '').slice(0, 256)] = value.trim().slice(0, 256);
    }
  }
  return trimmedMetadata;
};
