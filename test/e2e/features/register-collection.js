module.exports = function (userAssemblyIds, roomId) {
  return request
    .post('/collection/add')
    .send({
      userAssemblyIds: userAssemblyIds,
      socketRoomId: roomId
    });
};
