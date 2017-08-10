import React from 'react';

import { Section, Metadata } from './components';

export default ({ result }) => (
  <Section heading="Specieation" version={result.__v}>
    <dl className="wgsa-hub-stats-view">
      <Metadata label="Taxonomy ID">{result.organismId}</Metadata>
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
