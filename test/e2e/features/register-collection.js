module.exports = function (request, userAssemblyIds) {
  return request
    .post('/collection/add')
    .send({
      userAssemblyIds: userAssemblyIds
    });
};
