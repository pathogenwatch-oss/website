module.exports.id = require('./utils/getMigrationId.js')(__filename);

const updateDocs = require('./utils/updateDocs.js');
const slug = require('slug');

function toSlug(text) {
  if (!text) return '';

  const slugText = `-${slug(text, { lower: true })}`;
  return slugText.length > 64 ?
    slugText.slice(0, 64) :
    slugText;
}

function getToken({ alias, uuid, title }) {
  if (alias) return alias;
  return `${uuid}${toSlug(title)}`;
}

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;

  updateDocs(
    db.collection('collections').find({ token: { $exists: false } }, { alias: 1, uuid: 1, title: 1 }),
    ({ _id, ...collection }) =>
      db.collection('collections').update(
        { _id },
        { $set: { token: getToken(collection) } }
      )
  )
  .then(() => done())
  .catch(done);
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  done();
};
