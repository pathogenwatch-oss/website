import React from 'react';

import { CardMetadata } from '../card';

import { formatDay, formatMonth } from '../utils/Date';
import { getCountryName } from '../utils/country';

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

function displaySpecies(key, label) {
  if (!label) return null;
  return (
    <CardMetadata title="Species" icon="bug_report">
      <span title={key}>{label}</span>
    </CardMetadata>
  );
}

export default props => {
  const { speciesKey, speciesLabel, metadata = {}, country } = props;
  return (
    <div className="wgsa-card-content">
      {displaySpecies(speciesKey, speciesLabel)}
      {displayCountry(country)}
      {displayDate(metadata)}
    </div>
  );
};
