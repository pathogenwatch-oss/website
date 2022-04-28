import React from 'react';

const pubmedUrl = 'http://www.ncbi.nlm.nih.gov/pubmed';
const doiUrl = 'https://doi.org';
const text = { pubmed: 'Pubmed', doi: 'DOI' };

export default ({ className, linkTarget, linkType = 'pubmed', children }) => {
  const url = linkType === 'pubmed' ? pubmedUrl : doiUrl;
  return (
    linkTarget ?
      <a
        className={className}
        href={`${url}/${linkTarget}`}
        target="_blank"
        rel="noopener"
        title={`${linkType} ${linkTarget}`}
      >
        {children || text[linkType]}
      </a> :
      null
  );
};
