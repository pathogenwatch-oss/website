import React from 'react';

import { Section, Metadata } from '../components';

export default ({ __v, genotype, foundLoci }) => (
  <Section heading="Genotyphi" version={__v}>
    <dl>
      <Metadata label="Type">{genotype}</Metadata>
      <Metadata label="SNPs Called">{foundLoci}</Metadata>
    </dl>
  </Section>
);
