const assert = require('assert');

const species = require('wgsa_front-end/universal/species');
const downloads = require('models/speciesDownloads');

describe('Species Downloads', function () {
  for (let { nickname } of species) {
    for (let filename of Object.keys(downloads)) {
      let url = `/species/${nickname}/download/${filename}`;
      it(`GET ${url}`, function (done) {
        request
          .get(url)
          .end(function (error, result) {
            if (error) return done(error);
            console.log(result.text);
            done();
          });
      });
    }
  }
});
