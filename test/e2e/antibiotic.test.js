describe('Antibiotics Routes', function () {

  it('/api/v1/antibiotics', function (done) {
    var fixture = require('./fixtures/antibiotics.json');
    request.get('/api/v1/antibiotics')
      .expect(200, fixture, done);
  });

});
