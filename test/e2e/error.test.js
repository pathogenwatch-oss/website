describe('Error Routes', function () {

  it('GET /does-not-exist', function (done) {
    request
      .get('/does-not-exist')
      .expect(404, done);
  });

});
