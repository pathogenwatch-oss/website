import React from 'react';

import OrganismName from '../organisms/OrganismName.react';
import LiteratureLink from '../components/LiteratureLink.react';

import { getFormattedDateString } from '../utils/Date';
import { getCountryName } from '../utils/country';
import { Logo } from '../branding';

const SpeciesSubtitle = ({ analysis }) => {
  const { speciator, serotype = {} } = analysis;
  if (!speciator) return <em>Species prediction pending</em>;
  if (speciator.speciesId === '28901') {
    return (
      <OrganismName
        abbreviated
        speciesName={speciator.speciesName}
        subspecies={serotype.subspecies}
        serotype={serotype.value}
      />
    );
  } else if (speciator.organismId === '2697049') {
    return (<OrganismName speciesName={speciator.organismName} />);
  }
  return <OrganismName speciesName={speciator.speciesName} />;
};

export default ({ genome }) => {
  const { analysis = {}, country, literatureLink } = genome;
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
      {(date || country || literatureLink) && (
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
          {literatureLink && (
            <div className="pw-genome-report-metadata inline">
              <dt>Link</dt>
              <dd>
                <LiteratureLink
                  linkType={literatureLink.type}
                  linkTarget={literatureLink.value}
                />
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
};
