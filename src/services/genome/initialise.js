const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');
const validateMetadata = require('pathogenwatch-front-end/universal/validateMetadata');

module.exports = async function ({ user, data, uploadedAt }) {
  if (!user) {
    throw new ServiceRequestError('Not authenticated');
  }

  if (!Array.isArray(data)) {
    throw new ServiceRequestError('Data is not an array.');
  }

  try {
    for (const row of data) {
      validateMetadata(row);
    }
  } catch (e) {
    console.error(e);
    throw new ServiceRequestError(e.message);
  }

  return Genome.bulkWrite(
    data.map(row => {
      const metadata = Genome.getMetadataUpdate(row);
      return {
        insertOne: {
          document: {
            ...metadata,
            uploadedAt,
            createdAt: new Date(),
            _user: user._id,
          },
        },
      };
    })
  ).then(result =>
    data.map((_, i) => ({
      clientId: _.id,
      serverId: result.insertedIds[i],
    }))
  );
};
