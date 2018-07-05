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
      <div className="wgsa-genome-report-summary-content">
        <div>
          <h1 title={genome.name}>{genome.name}</h1>
          <div className="h5">
            { speciator ?
              <FormattedName fullName
                organismId={speciator.organismId}
                title={speciator.organismName}
              /> :
              <em>Pending speciation</em> }
          </div>
        </div>
        <p>
          Date:&nbsp;
          <strong>{date || '(unspecified)'}</strong>
          <br />
          Country:&nbsp;
          <strong>{country ? getCountryName(country) : '(unspecified)'}</strong>
          <br />
          PMID:&nbsp;
          {pmid ? <PubMedLink pmid={pmid}>{pmid}</PubMedLink> : <strong>(unspecified)</strong>}
        </p>
      </div>
    </div>
  );
};
