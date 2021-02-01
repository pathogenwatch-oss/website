import React from 'react';

import Section from './Section.react';

export default ({ autoSelect = true, disabled = false, listFilterActive, summary, children, ...props }) => (
  <Section
    {...props}
    autoSelect={autoSelect && !listFilterActive}
    disabled={disabled && !listFilterActive}
    summary={summary}
  >
    {summary.length === 0 && listFilterActive ? <p>No matches</p> : children}
  </Section>
);
