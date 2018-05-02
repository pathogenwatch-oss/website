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
      <section className="wgsa-genome-report-summary-content">
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
          {date}
          { date && <br /> }
          {country && getCountryName(country)}
          { country && <br /> }
          { pmid && <span>PMID: <PubMedLink pmid={pmid}>{pmid}</PubMedLink></span> }
        </p>
      </section>
    </div>
  );
};
