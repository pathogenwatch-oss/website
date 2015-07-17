module.exports = function (userAssemblyIds) {
  return request
    .post('/collection/add')
    .send({
      userAssemblyIds: userAssemblyIds
    });
};
