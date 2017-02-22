const Genome = require('models/genome');


module.exports = function (props) {
  const { user, query = {} } = props;
  const { skip = 0, limit = 0 } = query;
  const { speciesId, reference, owner, country, startDate, endDate } = query;

  const findQuery = Genome.getPrefilterCondition(props);

  if (speciesId) {
    findQuery.speciesId = speciesId;
  }

  if (country) {
    findQuery.country = country;
  }

  if (reference === 'true') {
    findQuery.reference = true;
  } else if (reference === 'false') {
    findQuery.reference = false;
  }

  if (owner === 'me') {
    findQuery._user = user;
  } else if (owner === 'other') {
    findQuery._user = { $ne: user };
  }

  if (startDate) {
    findQuery.date = { $gte: new Date(startDate) };
  }

  if (endDate) {
    findQuery.date = Object.assign(
      findQuery.date || {},
      { $lte: new Date(endDate) }
    );
  }

  return (
    Genome.
      find(
        findQuery,
        null,
        { skip: Number(skip), limit: Number(limit) }
      ).
      populate('_file').
      then(genomes => genomes.map(_ => _.toObject({ user })))
  );
};
