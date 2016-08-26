module.exports = function (assemblyNames) {
  return request
    .post('/api/species/1280/collection')
    .send({
      assemblyNames,
    });
};
