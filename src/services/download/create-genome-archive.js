const fastaStorage = require('wgsa-fasta-store');
const { fastaStoragePath } = require('configuration');

const Genome = require('models/genome');
const CollectionGenome = require('models/collectionGenome');
const { ServiceRequestError } = require('utils/errors');

const getFiles = {
  genome: (credentials, ids) => {
    const query = Object.assign(
      {}, Genome.getPrefilterCondition(credentials), { _id: { $in: ids } }
    );
    return (
      Genome.
        find(query, { _file: 1, name: 1 }).
        populate('_file').
        then(genomes =>
          genomes.map(({ name, _file }) => ({ name, id: _file.fileId })))
    );
  },
  collection: (_, ids) =>
    CollectionGenome.
      find({ _id: { $in: ids } }, { fileId: 1, name: 1 }).
      then(genomes =>
        genomes.map(({ name, fileId }) => ({ name, id: fileId }))),
};

module.exports = ({ user, sessionID, type, ids }) => {
  if (!(type in getFiles)) throw new ServiceRequestError('Invalid type');
  if (!ids || !ids.length) throw new ServiceRequestError('Missing Ids');

  return getFiles[type]({ user, sessionID }, ids).
    then(files => {
      if (files.length !== ids.length) throw new ServiceRequestError('Not all files found/accessible');
      return fastaStorage.archive(fastaStoragePath, files);
    });
};
