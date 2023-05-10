module.exports.transformer = function (doc) {
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.metrics.__v,
    'Genome Length': doc.analysis.metrics.length,
    'No. Contigs': doc.analysis.metrics.contigs,
    'Smallest Contig': doc.analysis.metrics.smallestContig,
    'Largest Contig': doc.analysis.metrics.largestContig,
    'Average Contig Length': doc.analysis.metrics.averageContig,
    N50: doc.analysis.metrics.N50,
    'non-ATCG': doc.analysis.metrics.nonATCG,
    'GC Content': doc.analysis.metrics.gcContent,
  };
};
