module.exports.transformer = (key) => (doc) => {
  const result = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis[key].__v,
    ST: doc.analysis[key].st,
  };

  for (const { gene, hits } of doc.analysis[key].alleles) {
    result[gene] = hits.join(',');
  }

  return result;
};
