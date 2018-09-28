import React from 'react';

import { Section, Metadata } from '../components';

export default ({ result }) => (
  <Section key={'Kleborate'} heading={'Kleborate'} version={result.__v}>
    <dl>
      {result && Object.keys(result)
        .map(prop =>
          <Metadata key={prop} label={prop}>
            {result[prop]}
          </Metadata>,
        )}
    </dl>
  </Section>
);



