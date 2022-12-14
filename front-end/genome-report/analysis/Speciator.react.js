import React from 'react';

import { Metadata } from '../components';

export default ({ result }) => (
  <React.Fragment>
    <h2>Organism prediction</h2>
    <dl className="grid">
      <Metadata label="Taxonomy ID">
        <a
          href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Tree&id=${result.organismId}`}
          target="_blank"
          rel="noopener"
          title="View in NCBI taxonomy browser"
        >
          {result.organismId}
        </a>
      </Metadata>
      <Metadata label="Organism name">{result.organismName}</Metadata>
      <Metadata label="RefSeq reference">
        <a href={`http://www.ncbi.nlm.nih.gov/assembly/${result.referenceId}/`} target="_blank" rel="noopener">
          {result.referenceId}
        </a>
      </Metadata>
      <Metadata label="Mash distance">{result.mashDistance}</Metadata>
      <Metadata label="p-value">{result.pValue}</Metadata>
      <Metadata label="Matching hashes">{result.matchingHashes}</Metadata>
    </dl>
  </React.Fragment>
);
