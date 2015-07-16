describe('Antibiotics Routes', function () {

  it('/api/all-antibiotics', function (done) {
    var fixture = require('./fixtures/antibiotics.json');
    request.get('/api/all-antibiotics')
      .expect(200, fixture, done);
  });

});
