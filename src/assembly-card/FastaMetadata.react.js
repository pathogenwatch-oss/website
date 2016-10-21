import React from 'react';

import { CardMetadata } from '../card';

import { formatDay, formatMonth } from '../utils/Date';

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
  if (!country || !country.name) return null;
  return (
    <CardMetadata title="Country" icon="place">
      <span>{country.name}</span>
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
  const { speciesKey, speciesLabel, metadata = {}, country = { name: 'UK' } } = props;
  return (
    <div className="wgsa-card-content">
      {displaySpecies(speciesKey, speciesLabel)}
      {displayCountry(country)}
      {displayDate(metadata)}
    </div>
  );
};
