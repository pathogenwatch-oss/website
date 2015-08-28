module.exports = function (userAssemblyIds, roomId) {
  return request
    .post('/api/species/1280/collection')
    .send({
      userAssemblyIds: userAssemblyIds,
      socketRoomId: roomId
    });
};
