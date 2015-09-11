module.exports = function (assemblyNames, roomId) {
  return request
    .post('/api/species/1280/collection')
    .send({
      assemblyNames: assemblyNames,
      socketRoomId: roomId
    });
};
