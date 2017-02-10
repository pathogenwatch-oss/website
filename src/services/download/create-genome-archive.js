const fastaStorage = require('wgsa-fasta-store');
const { fastaStoragePath } = require('configuration');

const Genome = require('models/genome');
const CollectionGenome = require('models/collectionGenome');
const { ServiceRequestError } = require('utils/errors');

const getFiles = {
  genome: ids =>
    Genome.
      find({ _id: { $in: ids } }, { _file: 1, name: 1 }).
      populate('_file').
      then(genomes =>
        genomes.map(({ name, _file }) => ({ name, id: _file.fileId }))),
  collectionGenome: ids =>
    CollectionGenome.
      find({ _id: { $in: ids } }, { fileId: 1, name: 1 }).
      then(genomes =>
        genomes.map(({ name, fileId }) => ({ name, id: fileId }))),
};

module.exports = ({ type, ids }) => {
  if (!(type in getFiles)) throw new ServiceRequestError('Invalid type');
  if (!ids || !ids.length) throw new ServiceRequestError('Missing Ids');

  return getFiles[type](ids).
    then(files => fastaStorage.archive(fastaStoragePath, files));
};
