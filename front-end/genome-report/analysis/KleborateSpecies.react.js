/* eslint-disable react/prop-types */
import React from 'react';

import ExternalLink from '../ExternalLink.react';

export default ({ genome }) => {
  const { kleborate, speciator } = genome.analysis;
  // const species = !speciator.speciesName.replace('Raoultella', 'Klebsiella').startsWith(kleborate.species);

  return (
    <React.Fragment>
      <dl className="pw-genome-report-unsized">
        <div className="pw-genome-report-metadata">
          <dt className="danger">Kleborate species conflict</dt>
          <dd>{ kleborate.species }</dd>
        </div>
      </dl>
    </React.Fragment>
  );
};
