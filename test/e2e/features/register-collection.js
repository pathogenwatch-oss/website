module.exports = function (userAssemblyIds, roomId) {
  return request
    .post('/api/v1/collection/add')
    .send({
      userAssemblyIds: userAssemblyIds,
      socketRoomId: roomId
    });
};
