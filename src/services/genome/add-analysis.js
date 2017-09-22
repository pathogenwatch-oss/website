const { request } = require('services/bus');

const Genome = require('models/genome');
const CollectionGenome = require('models/collectionGenome');

const formatters = {
  mlst: ({ st, url, genes, alleles }) => ({
    st,
    url,
    alleles: genes.map(gene => ({ gene, hits: alleles[gene].map(_ => _.id) })),
  }),
  paarsnp: result => ({
    antibiotics: result.resistanceProfile ?
      result.resistanceProfile.map(
        ({ agent, resistanceState, resistanceSets }) => ({
          name: agent.name,
          fullName: agent.fullName,
          state: resistanceState,
          mechanisms: resistanceSets.reduce(
            (memo, _) => memo.concat(_.elementIds), []
          ),
        })
      ) : [],
    paar: result.paarResult ?
      result.paarResult.paarElementIds || [] : [],
    snp: result.snparResult ?
      result.snparResult.resistanceMutationIds || [] : [],
  }),
  genotyphi: _ => ({
    genotype: _.genotype,
    foundLoci: _.foundLoci,
  }),
};

function formatResult(task, version, result) {
  const format = formatters[task];
  return Object.assign(
    { __v: version },
    format ? format(result, version) : result
  );
}

module.exports = function ({ genomeId, collectionId, uploadedAt, task, version, result, clientId }) {
  const formattedResult = formatResult(task, version, result);

  if (collectionId) {
    return (
      CollectionGenome.addAnalysisResult(genomeId, task, formattedResult)
        .then(() =>
          request('collection', 'send-progress', { collectionId })
        )
    );
  }

  return (
    Genome.addAnalysisResult(genomeId, task, formattedResult)
      .then(() => {
        if (clientId) {
          request('notification', 'send', {
            channel: clientId,
            topic: `analysis-${uploadedAt}`,
            message: { id: genomeId, task, result: formattedResult },
          });
        }
      })
  );
};
