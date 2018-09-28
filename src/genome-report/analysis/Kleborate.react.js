import React from 'react';
export default ({ result }) => (
  <React.Fragment>
    <h2>Kleborate</h2>
    <dl>
      <div>
        <dt>ST</dt>
        <dd>{result.ST}</dd>
      </div>
      <div>
        <dt>Virulence Score</dt>
        <dd>{result.virulence_score}</dd>
      </div>
    </dl>
  </React.Fragment>
);


