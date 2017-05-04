const Genome = require('models/genome');

function getSort(sort) {
  const sortOrder = (sort.slice(-1) === '-') ? -1 : 1;
  const sortKey = sortOrder === 1 ? sort : sort.substr(0, sort.length - 1);

  if (sortKey === 'date') {
    return { year: sortOrder, month: sortOrder, day: sortOrder };
  }

  if (sortKey === 'access') {
    return { public: sortOrder, reference: sortOrder };
  }

  return { [sortKey]: sortOrder };
}

module.exports = function (props) {
  const { user, query = {} } = props;
  const { skip = 0, limit = 0, searchText, sort = 'createdAt-' } = query;
  const { organismId, reference, owner, country, minDate, maxDate, uploadedAt } = query;

  const findQuery = Genome.getPrefilterCondition(props);

  if (searchText) {
    findQuery.$text = { $search: searchText };
  }

  if (organismId) {
    findQuery.organismId = organismId;
  }

  if (country) {
    findQuery.country = country;
  }

  if (reference === 'true') {
    findQuery.reference = true;
  } else if (reference === 'false') {
    findQuery.reference = false;
  }

  if (user) {
    if (owner === 'me') {
      findQuery._user = user;
    } else if (owner === 'other') {
      findQuery._user = { $ne: user };
    }

    if (uploadedAt) {
      findQuery.uploadedAt = uploadedAt;
    }
  }

  if (minDate) {
    findQuery.date = { $exists: true, $gte: new Date(minDate) };
  }

  if (maxDate) {
    findQuery.date = Object.assign(
      findQuery.date || {},
      { $exists: true, $lte: new Date(maxDate) }
    );
  }

  return (
    Genome
      .find(
        findQuery,
        null, {
          skip: Number(skip),
          limit: Number(limit),
          sort: getSort(sort),
        }
      )
      .populate('_file')
      .lean()
      .then(genomes => genomes.map(_ => Genome.toObject(_, user)))
  );
};
