import React from 'react';

import { FormattedName } from '../../organisms';
import PubMedLink from '../../components/PubMedLink.react';

import { getFormattedDateString } from '../../utils/Date';
import { getCountryName } from '../../utils/country';
import { Logo } from '../../branding';

function getTask({ analysis = {}, tasks = [] }, taskName) {
  return analysis[taskName];
}

export default ({ genome }) => {
  const { country, pmid } = genome;
  const speciator = getTask(genome, 'speciator');
  const date = getFormattedDateString(genome);
  return (
    <div className="wgsa-genome-report-summary">
      <header>
        <Logo />
      </header>
      <h1 title={genome.name}>{genome.name}</h1>
      <div className="h5">
        { speciator ?
          <FormattedName fullName
            organismId={speciator.organismId}
            title={speciator.organismName}
          /> :
          <em>Pending speciation</em> }
      </div>
      <dl>
        <div>
          <dt>Date</dt>
          <dd>{date}</dd>
        </div>
        <div>
          <dt>Country</dt>
          <dd>{getCountryName(country)}</dd>
        </div>
        <div>
          <dt>PMID</dt>
          <dd><PubMedLink pmid={pmid}>{pmid}</PubMedLink></dd>
        </div>
      </dl>
    </div>
  );
};
