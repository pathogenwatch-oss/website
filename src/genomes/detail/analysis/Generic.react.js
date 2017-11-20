import React from 'react';

import { Section, Metadata } from '../components';

export default (results = {}, tasks) => (
  Object.keys(results).map(key => {
    const props = tasks.find(_ => _.task === key && _.version === results[key]);
    return (
      <Section key={key} heading={key} version={results[key]}>
        <dl>
          { props && Object.keys(props.results).map(prop =>
              <Metadata key={prop} label={prop}>{props[prop]}</Metadata>
          )}
        </dl>
      </Section>
    );
  })
);
