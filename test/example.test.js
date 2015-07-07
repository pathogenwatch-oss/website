var supertest = require('supertest');
var sinon = require('sinon');

var server = require('../server');
var request = supertest(server);

describe('Example tests', function () {

  describe('Controller: Assembly', function () {

    /**
      * This example mocks the result and makes the test very trivial. The
      * mocking is included for illustration, as the request testing will likely
      * be used at an integration and end-to-end level.
      */
    it('should get the resistance profile', function (done) {
      var assemblyController = require('controllers/assembly');
      var profile = { methicillin: true };

      // This would usually override a private method with rewire's `__set__`,
      // but I didn't want to change the controller module
      assemblyController.getResistanceProfile =
        sinon.stub().yields(null, profile);

      request.post('/api/assembly/resistance-profile')
        .expect(200, { resistanceProfile: profile }, done);
    });

    it('should return an error code', function (done) {
      var assemblyController = require('controllers/assembly');

      assemblyController.getResistanceProfile =
        sinon.stub().yields(new Error());

      request.post('/api/assembly/resistance-profile')
        .expect(500, done);
    });

  });

});
