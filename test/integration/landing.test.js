describe('Landing Routes', function () {

  it('GET /', function (done) {
    request
      .get('/')
      .expect(200, done);
  });

  it('POST /subscribe', function (done) {
    request
      .post('/subscribe')
      .send({ email: 'rg14@sanger.ac.uk' })
      .expect(200, {}, done);
  });

  it('POST /subscribe [error]', function (done) {
    request
      .post('/subscribe')
      .expect(500, done);
  });

  it('POST /feedback', function (done) {
    request
      .post('/feedback')
      .send({
        name: 'Richard',
        email: 'rg14@sanger.ac.uk',
        feedback: 'It\'s awesome!'
      })
      .expect(200, {}, done);
  });

});
