var assert = require('assert');
var jsdom = require('mocha-jsdom');

describe('API Client', function () {

  var config = require('../../config.json').server.node;

  jsdom({
    url: 'http://' + config.hostname + ':' + config.port
  });

  describe('getProject()', function () {

    it('should fetch a project', function (done) {
      var Api = require('../../private/js/utils/Api');
      var projectId = require('../fixture.json').shortId;

      Api.getProject(projectId, function (error, project) {
        if (error) {
          done(error);
        }
        assert.equal(project.shortId, projectId);
        done();
      });
    });

    it('should return an error for a 404', function (done) {
      var Api = require('../../private/js/utils/Api');

      Api.getProject('doesntexist', function (error) {
        assert(error !== null);
        done();
      });
    });

    it('should return immediately if missing project ID', function (done) {
      var Api = require('../../private/js/utils/Api');

      Api.getProject(null, function (error) {
        assert(error && error.message === 'Missing project ID');
        done();
      });
    });

  });

  describe('updateShortId()', function () {

    it('should update the short ID without an error', function (done) {
      var Api = require('../../private/js/utils/Api');
      var shortId = require('../fixture.json').shortId;

      Api.updateShortId(shortId, 'updated', done);
    });

    it('should require a project ID', function (done) {
      var Api = require('../../private/js/utils/Api');

      Api.updateShortId(null, 'updated', function (error) {
        assert(error);
        done();
      });
    });

    it('should require a new short ID', function (done) {
      var Api = require('../../private/js/utils/Api');

      Api.updateShortId('shortId', null, function (error) {
        assert(error);
        done();
      });
    });

    it('should check if the new short id matches the existing one', function (done) {
      var Api = require('../../private/js/utils/Api');

      Api.updateShortId('shortId', 'shortId', function (error) {
        assert(error);
        done();
      });
    });

  });

});
