import React from 'react';

import { formatDay, formatMonth } from '../utils/Date';

function displayDate({ day, month, year }) {
  if (!day && !month && !year) {
    return null;
  }
  return (
    <div className="wgsa-card__metadata">
      <i title="Date" className="material-icons">date_range</i>
      {day ? `${formatDay(day)} ` : ''}
      {month ? `${formatMonth(month)} ` : ''}
      {year || ''}
    </div>
  );
}

function displayCountry(country) {
  if (!country || !country.name) return null;
  return (
    <div className="wgsa-card__metadata">
      <i title="Country" className="material-icons">place</i>
      <span>{country.name}</span>
    </div>
  );
}

function displaySpecies(key, label) {
  if (!label) return null;
  return (
    <div className="wgsa-card__metadata">
      <i title="Species" className="material-icons">bug_report</i>
      <span title={key}>{label}</span>
    </div>
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
