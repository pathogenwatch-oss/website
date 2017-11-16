import React from 'react';

import { Section, Metadata } from '../components';

export default ({ result }) => (
  <Section heading="Speciator" version={result.__v}>
    <dl>
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
      <Metadata label="Organism Name">{result.organismName}</Metadata>
      <Metadata label="Reference">
        <a href={`http://www.ncbi.nlm.nih.gov/assembly/${result.referenceId}/`} target="_blank" rel="noopener">
          {result.referenceId}
        </a>
      </Metadata>
      <Metadata label="Mash Distance">{result.mashDistance}</Metadata>
      <Metadata label="p-value">{result.pValue}</Metadata>
      <Metadata label="Matching Hashes">{result.matchingHashes}</Metadata>
    </dl>
  </Section>
);
