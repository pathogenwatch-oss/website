const mapLimit = require('promise-map-limit');

module.exports = function (cursor, updateTteratee, limit = 100) {
  return (
    cursor.toArray()
      .then(docs => {
        console.log('       Updating %s documents...', docs.length);
        let index = 0;
        return mapLimit(docs, limit, doc => {
          process.stdout.write(`\r       Updating document ${++index} of ${docs.length}`);
          return updateTteratee(doc);
        })
        .then(() => console.log(`\n       ${docs.length} documents have been updated`));
      })
  );
};
