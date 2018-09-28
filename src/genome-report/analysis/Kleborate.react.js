import React from 'react';

import { Section, Metadata } from '../components';

export default ({ result }) => (
  <Section key={'Kleborate'} heading={'Kleborate'} version={''}>
    <dl>
      {result && Object.keys(result)
        .filter(prop => [ '__v', '', 'ST' ].includes(prop))
        .sort()
        .map(prop =>
          <Metadata key={prop} label={prop.replace('_', '')}>
            {result[prop]}
          </Metadata>,
        )}
    </dl>
  </Section>
);



