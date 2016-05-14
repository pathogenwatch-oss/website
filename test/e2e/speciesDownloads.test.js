const assert = require('assert');

const species = require('wgsa_front-end/universal/species');
const downloads = require('models/speciesDownloads');

describe.only('Species Downloads', function () {
  for (let { nickname } of species) {
    for (let filename of Object.keys(downloads)) {
      let url = `/species/${nickname}/download/${filename}`;
      it(`GET ${url}`, done =>
        request
          .get(url)
          .expect(200)
          .expect('Content-Type', new RegExp(`̣\^${downloads[filename].contentType}`))
          .end(done)
      );
    }
  }
});
