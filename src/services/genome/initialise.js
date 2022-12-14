const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');
const validateMetadata = require('../../../universal/validateMetadata');

module.exports = async function ({ user, data, uploadedAt }) {
  if (!user) {
    throw new ServiceRequestError('Not authenticated');
  }

  if (!Array.isArray(data)) {
    throw new ServiceRequestError('Data is not an array');
  }

  try {
    for (const row of data) {
      if (!row.id) {
        throw new Error('Missing client id');
      }
      validateMetadata(row.metadata);
    }
  } catch (e) {
    console.error(e);
    throw new ServiceRequestError(e.message);
  }

  return Genome.bulkWrite(
    data.map((row) => ({
      insertOne: {
        document: {
          name: row.id,
          ...Genome.getMetadataUpdate(row.metadata),
          _user: user._id,
          createdAt: new Date(),
          upload: {
            type: row.type,
            files: row.files,
          },
          uploadedAt,
        },
      },
    }))
  ).then((result) => {
    const idMap = {};
    for (let i = 0; i < data.length; i++) {
      idMap[data[i].id] = result.insertedIds[i];
    }
    return idMap;
  });
};
