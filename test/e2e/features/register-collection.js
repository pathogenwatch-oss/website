module.exports = function (userAssemblyIds, roomId) {
  return request
    .post('/api/v1/collection')
    .send({
      userAssemblyIds: userAssemblyIds,
      socketRoomId: roomId
    });
};
