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
  const { skip = 0, limit = 0, sort = 'createdAt-' } = query;

  return (
    Genome
      .find(
        Genome.getFilterQuery(props),
        null, {
          skip: Number(skip),
          limit: Number(limit),
          sort: getSort(sort),
        }
      )
      .lean()
      .then(genomes => genomes.map(_ => Genome.toObject(_, user)))
  );
};
