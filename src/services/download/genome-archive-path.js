const fastaStorage = require('wgsa-fasta-store');

const GenomeArchive = require('models/genomeArchive');

const { fastaStoragePath } = require('configuration');
const { ServiceRequestError } = require('utils/errors');

module.exports = ({ id, user, sessionID }) =>
  GenomeArchive.findOne({ _id: id, $or: [ { _session: sessionID } ].concat(user ? { _user: user._id } : []) }).
    then(record => {
      if (!record) throw new ServiceRequestError('Archive record not found/accessible');
      return fastaStorage.getArchivePath(fastaStoragePath, record.fileId);
    });
