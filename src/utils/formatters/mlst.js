module.exports = ({ st, url, genes, alleles }) => {
  const formattedAlleles = [];
  const matches = [];

  for (const gene of genes) {
    const hits = alleles[gene];
    formattedAlleles.push({
      gene,
      hits: hits.map(_ => _.id),
    });
    for (const hit of hits) {
      matches.push(Object.assign({ gene }, hit));
    }
  }

  return {
    st,
    url,
    alleles: formattedAlleles,
    matches,
  };
};
