const Genome = require('models/genome');

module.exports = function (props) {
  const query = Object.assign(
    { latitude: { $exists: true }, longitude: { $exists: true } },
    Genome.getFilterQuery(props)
  );
  return (
    Genome
      .find(query, { latitude: 1, longitude: 1, name: 1 })
      .lean()
      .then(docs => {
        for (const doc of docs) {
          doc.id = doc._id;
          doc._id = undefined;
          doc.title = doc.name;
          doc.name = undefined;
        }
        return docs;
      })
  );
};
