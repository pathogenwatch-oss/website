import React from 'react';

import { Section, Metadata } from '../components';

export default (results = {}) => (
  Object.keys(results).map(key => {
    const props = results[key];
    return (
      <Section key={key} heading={key} version={results[key].__v}>
        <dl>
          { props && Object.keys(props).map(prop =>
            <Metadata key={prop} label={prop}>
              {props[prop]}
            </Metadata>
          )}
        </dl>
      </Section>
    );
  })
);
