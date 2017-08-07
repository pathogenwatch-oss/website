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

const config = require('configuration');

const maxLimit = config.maxCollectionSize.loggedIn || 500;

module.exports = function (props) {
  const { user, query = {} } = props;
  const { skip = 0, limit = maxLimit, sort = 'createdAt-' } = query;

  return (
    Genome
      .find(
        Genome.getFilterQuery(props),
        { name: 1,
          organismId: 1,
          organismName: '$analysis.specieator.organismName',
          date: 1,
          country: 1,
          reference: 1,
          public: 1,
          uploadedAt: 1,
          _user: 1,
        },
        { skip: Number(skip), limit: Math.min(Number(limit), maxLimit), sort: getSort(sort) }
      )
      .lean()
      .then(genomes => genomes.map(_ => Genome.toObject(_, user)))
  );
};
