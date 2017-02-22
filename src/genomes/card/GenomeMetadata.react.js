import React from 'react';

import { CardMetadata } from '../../card';

import { formatDay, formatMonth } from '../../utils/Date';
import { getCountryName } from '../../utils/country';

import { FormattedSpeciesName } from '../../species';

function displayDate({ day, month, year }) {
  if (!day && !month && !year) {
    return null;
  }
  return (
    <CardMetadata title="Date" icon="date_range">
      {day ? `${formatDay(day)} ` : ''}
      {month ? `${formatMonth(month)} ` : ''}
      {year || ''}
    </CardMetadata>
  );
}

function displayCountry(country) {
  if (!country) return null;
  return (
    <CardMetadata title="Country" icon="place">
      <span>{getCountryName(country)}</span>
    </CardMetadata>
  );
}

function displaySpecies(speciesId, title) {
  if (!title) return null;
  return (
    <CardMetadata title="Species" icon="bug_report">
      <FormattedSpeciesName speciesId={speciesId} title={title} />
    </CardMetadata>
  );
}

export default props => {
  const { speciesId, speciesName, country, ...metadata } = props;
  return (
    <div className="wgsa-card-content">
      {displaySpecies(speciesId, speciesName)}
      {displayCountry(country)}
      {displayDate(metadata)}
    </div>
  );
};
