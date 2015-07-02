describe('Project Routes', function () {

  it('POST /api/1.0/project [Bad Request]', function (done) {
    request
      .post('/api/1.0/project')
      .send({})
      .expect(400, done);
  });

  it('POST /api/1.0/project [Bad Request - missing tree]', function (done) {
    var fixture = {
      isolates: require('../fixture.json').isolates
    };
    request
      .post('/api/1.0/project')
      .send(fixture)
      .expect(400, done);
  });

  it('POST /api/1.0/project [Bad Request - missing isolates]', function (done) {
    var fixture = {
      tree: require('../fixture.json').tree
    };
    request
      .post('/api/1.0/project')
      .send(fixture)
      .expect(400, done);
  });

  it('POST /api/1.0/project', function (done) {
    var fixture = {
      isolates: require('../fixture.json').isolates,
      tree: require('../fixture.json').tree
    };
    request
      .post('/api/1.0/project')
      .send(fixture)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function (result) {
        if (result.body.tree) {
          return 'Should not return tree';
        }
        if (result.body.isolates) {
          return 'Should not return isolates';
        }
        if (!result.body.id) {
          return 'Should return id';
        }
        if (!result.body.shortId) {
          return 'Should return short id';
        }
        if (!result.body.date_created) {
          return 'should return date_created';
        }
        if (!result.body.last_updated) {
          return 'should return last_updated';
        }
      })
      .end(done);
  });

  it('GET /api/1.0/project/:shortId [Not Found]', function (done) {
    request
      .get('/api/1.0/project/doesntexist')
      .expect(404, done);
  });

  it('GET /api/1.0/project/:shortId', function (done) {
    var shortId = require('../fixture.json').shortId;
    request
      .get('/api/1.0/project/' + shortId)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function (result) {
        if (!result.body) {
          return 'Missing project';
        }
      })
      .end(done);
  });

  it('GET /api/1.0/project/:shortId [Not Found]', function (done) {
    request
      .get('/api/1.0/project/doesntexist')
      .expect(404, done);
  });

  it('PUT /api/1.0/project/:shortId/shortId', function (done) {
    var shortId = require('../fixture.json').shortId;
    request
      .put('/api/1.0/project/' + shortId + '/shortId')
      .set('Content-Type', 'text/plain')
      .send('updated')
      .expect(200, done);
  });

  it('PUT /api/1.0/project/:shortId/shortId [Bad Request]', function (done) {
    var shortId = require('../fixture.json').shortId;
    request
      .put('/api/1.0/project/' + shortId + '/shortId')
      .set('Content-Type', 'text/plain')
      .send()
      .expect(400, done);
  });

  it('PUT /api/1.0/project/:shortId/shortId [Conflict - duplicate id]', function (done) {
    var shortId = require('../fixture.json').shortId;
    request
      .put('/api/1.0/project/' + shortId + '/shortId')
      .set('Content-Type', 'text/plain')
      .send('earss')
      .expect(409, done);
  });

  it('PUT /api/1.0/project/:shortId/shortId [Conflict - updating earss record]', function (done) {
    var shortId = require('../fixture.json').shortId;
    request
      .put('/api/1.0/project/earss/shortId')
      .set('Content-Type', 'text/plain')
      .send('ssrae')
      .expect(409, done);
  });

});
