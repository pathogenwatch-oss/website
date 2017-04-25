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
  const { organismId, reference, owner, country, startDate, endDate } = query;

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
      .then(genomes => genomes.map(_ => _.toObject({ user })))
  );
};
