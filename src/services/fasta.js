const fastaStorage = require('wgsa-fasta-store');
const { fastaStoragePath } = require('configuration');
fastaStorage.setup(fastaStoragePath);

const Fasta = require('../data/fasta');
const { getCountryCode } = require('models/assemblyMetadata');

const { register } = require('./bus');
const { ServiceRequestError } = require('../utils/errors');

function store({ stream, metadata }) {
  if (!stream) return Promise.reject(new ServiceRequestError('No stream provided'));

  const country = getCountryCode(metadata);
  return fastaStorage.store(fastaStoragePath, stream)
    .then(({ fileId, metrics, specieator: { taxId, scientificName } }) =>
      Fasta.create({
        fileId,
        speciesId: taxId,
        speciesName: scientificName,
        metrics,
      })
    ).then(fasta => Object.assign({ country }, fasta.toObject()));
}

const role = 'fasta';
register(role, 'store', store);
