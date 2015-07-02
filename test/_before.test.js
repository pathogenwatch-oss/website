var supertest = require('supertest');

var resetDatabase = require('./fixtures');

before(function (done) {
  require('../server')(function (error, app) {
    if (error) {
      return console.error(error);
    }
    global.request = supertest(app);
    done();
  });
});

beforeEach(resetDatabase);
