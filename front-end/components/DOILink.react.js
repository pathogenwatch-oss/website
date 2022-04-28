import React from 'react';

export default ({ className, doi, children = 'DOI' }) => (
  doi ?
    <a
      className={className}
      href={`https://doi.org/${doi}`}
      target="_blank"
      rel="noopener"
      title={`DOI ${doi}`}
    >
      {children}
    </a> :
    null
);
