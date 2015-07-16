var supertest = require('supertest');

before(function (done) {
  this.timeout(5000);
  require('../../server')(function (error, app) {
    if (error) {
      done(error);
    }
    global.request = supertest(app);
    done();
  });
});
