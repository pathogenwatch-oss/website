module.exports = function (request, requestData) {
  return request
    .post('/assembly/add')
    .send(requestData);
};
