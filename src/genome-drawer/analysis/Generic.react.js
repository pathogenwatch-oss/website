import React from 'react';

import { Section, Metadata } from '../components';

export default (results = {}) => (
  Object.keys(results).map(key => {
    const { __v, ...props } = results[key];
    return (
      <Section key={key} heading={key} version={__v}>
        <dl className="wgsa-hub-stats-view">
          { Object.keys(props).map(prop =>
              <Metadata key={prop} label={prop}>{props[prop]}</Metadata>
          )}
        </dl>
      </Section>
    );
  })
);
