const Genome = require('models/genome');

module.exports = async function (props) {
  const query = {
    ...await Genome.getFilterQuery(props),
    'analysis.metrics': { $exists: true },
  };
  // const sort = Genome.getSort(props.sort);
  return (
    Genome
      .find(query, {
        name: 1,
        'analysis.metrics.length': 1,
        'analysis.metrics.N50': 1,
        'analysis.metrics.contigs': 1,
        'analysis.metrics.nonATCG': 1,
        'analysis.metrics.gcContent': 1,
      })
      // , {
      //   sort,
      // }
      .lean()
      .then(
        (docs) => docs.map(({ _id, name, analysis }) => ({
          id: _id,
          name,
          length: analysis.metrics.length,
          N50: analysis.metrics.N50,
          contigs: analysis.metrics.contigs,
          nonATCG: analysis.metrics.nonATCG,
          gcContent: analysis.metrics.gcContent,
        }))
      )
  );
};
