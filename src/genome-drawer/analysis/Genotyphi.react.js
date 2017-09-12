import React from 'react';

import { Section, Metadata } from '../components';

export default ({ __v, type, snpsCalled }) => (
  <Section heading="Genotyphi" version={__v}>
    <dl>
      <Metadata label="Type">{type}</Metadata>
      <Metadata label="SNPs Called">{snpsCalled}</Metadata>
    </dl>
  </Section>
);
