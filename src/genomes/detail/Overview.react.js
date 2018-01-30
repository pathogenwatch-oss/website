import React from 'react';

import { FormattedName } from '../../organisms';
import PubMedLink from '../../components/PubMedLink.react';

import { getFormattedDateString } from '../../utils/Date';
import { getCountryName } from '../../utils/country';

function getTask({ analysis = {}, tasks = [] }, taskName) {
  return analysis[taskName];
}

export default ({ genome }) => {
  const { country, pmid } = genome;
  const speciator = getTask(genome, 'speciator');
  const date = getFormattedDateString(genome);
  return (
    <div className="wgsa-genome-detail-summary">
      <header>
        <img src="/images/WGSA.FINAL.svg" />
      </header>
      <aside>
        {date}
        { date && <br /> }
        {country && getCountryName(country)}
        { country && <br /> }
        { pmid && <span>PMID: <PubMedLink pmid={pmid}>{pmid}</PubMedLink></span> }
      </aside>
      <h1>{genome.name}</h1>
      <div className="h4">
        { speciator ?
          <FormattedName fullName
            organismId={speciator.organismId}
            title={speciator.organismName}
          /> :
          <em>Pending speciation</em> }
      </div>
    </div>
  );
};
