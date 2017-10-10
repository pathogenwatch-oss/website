const getSource = require('../sources');

module.exports = ({ st, url, genes, alleles }) => {
  const matches = [];

  for (const gene of genes) {
    for (const hit of alleles[gene]) {
      matches.push(Object.assign({ gene }, hit));
    }
  }

  return {
    st,
    url,
    source: getSource(url),
    matches,
  };
};
