const mongoConnection = require('utils/mongoConnection');
const mapLimit = require('promise-map-limit');

require('services');
const Genome = require('models/genome');


function fetchGenomes(query) {
  return Genome.find({ _id: '5a008ded8ebadf6d9112ab8a' }, { _id: 0 }).lean();
}

function duplicate(genomes) {
  const promises = [];

  for (let i = 0; i < 1000; i++) {
    promises.push(i);
  }

  return mapLimit(promises, 10, () => Genome.create(genomes[0]));
}

mongoConnection.connect()
  .then(fetchGenomes)
  .then(duplicate)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
