const fastaStorage = require('wgsa-fasta-store');
const { fastaStoragePath } = require('configuration');
fastaStorage.setup(fastaStoragePath);

const { getCountryCode } = require('models/assemblyMetadata');

const { register } = require('./bus');
const { ServiceRequestError } = require('../utils/errors');

function store({ stream, metadata }) {
  if (!stream) return Promise.reject(new ServiceRequestError('No stream provided'));

  return fastaStorage.store(fastaStoragePath, stream)
    .then(({ fileId, metrics, specieator: { taxId, scientificName } }) => {
      const country = getCountryCode(metadata);
      return {
        id: fileId,
        speciesId: taxId,
        speciesName: scientificName,
        metrics,
        country,
      };
    });
}

const role = 'fasta';
register(role, 'store', store);
