const Genome = require('models/genome');
const { ObjectId } = require('mongoose').Types;

const { ServiceRequestError } = require('utils/errors');
const validateMetadata = require('../../../universal/validateMetadata');

module.exports = async function ({ user, data }) {
  if (!user) {
    throw new ServiceRequestError('Not authenticated');
  }

  if (!Array.isArray(data)) {
    throw new ServiceRequestError('Data is not an array.');
  }

  const queries = [];

  try {
    for (const row of data) {
      if (!row.id) throw new Error(`Missing id in row ${data.indexOf(row)}`);
      validateMetadata(row);
      queries.push({ _id: new ObjectId(row.id), _user: new ObjectId(user._id) });
    }
  } catch (e) {
    console.error(e);
    throw new ServiceRequestError(e.message);
  }

  const count = await Genome.count({ $or: queries });

  if (count !== data.length) {
    throw new ServiceRequestError('Permissions mismatch.');
  }

  const computedData = {};
  const lastUpdatedAt = new Date();

  return Genome.bulkWrite(
    data.map((row, i) => {
      const update = Genome.getMetadataUpdate(row);
      update.lastUpdatedAt = lastUpdatedAt;
      computedData[row.id] = {
        country: update.country,
        date: update.date,
      };
      return {
        updateOne: {
          filter: queries[i],
          update,
        },
      };
    })
  ).then((result) => ({
    matched: result.matchedCount,
    modified: result.modifiedCount,
    computedData,
  }));
};
