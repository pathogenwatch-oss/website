import React from 'react';

import OrganismName from '../organisms/OrganismName.react';
import PubMedLink from '../components/PubMedLink.react';

import { getFormattedDateString } from '../utils/Date';
import { getCountryName } from '../utils/country';
import { Logo } from '../branding';

const SpeciesSubtitle = ({ analysis }) => {
  const { speciator, serotype = {} } = analysis;
  if (!speciator) return <em>Species prediction pending</em>;
  if (speciator.species === '28901') {
    return (
      <OrganismName
        speciesName={speciator.speciesName}
        subspecies={serotype.subspecies}
        serotype={serotype.value}
      />
    );
  }
  return <OrganismName speciesName={speciator.speciesName} />;
};

export default ({ genome }) => {
  const { analysis = {}, country, pmid } = genome;
  const date = getFormattedDateString(genome);
  return (
    <div className="wgsa-genome-report-summary">
      <header>
        <h1 title={genome.name} className="h2">
          {genome.name}
        </h1>
        <Logo />
      </header>
      <p className="h6 pw-genome-report-summary-subtitle">
        <SpeciesSubtitle analysis={analysis} />
      </p>
      {(date || country || pmid) && (
        <dl>
          {country && (
            <div className="pw-genome-report-metadata inline">
              <dt>Country</dt>
              <dd>{getCountryName(country)}</dd>
            </div>
          )}
          {date && (
            <div className="pw-genome-report-metadata inline">
              <dt>Date</dt>
              <dd>{date}</dd>
            </div>
          )}
          {pmid && (
            <div className="pw-genome-report-metadata inline">
              <dt>PMID</dt>
              <dd>
                <PubMedLink pmid={pmid}>{pmid}</PubMedLink>
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
};
