import React from 'react';

export default ({ className, pmid, children = 'PubMed' }) => (
  pmid ?
    <a
      className={className}
      href={`http://www.ncbi.nlm.nih.gov/pubmed/${pmid}`}
      target="_blank"
      rel="noopener"
      title="View Publication"
    >
      {children}
    </a> :
    null
);
