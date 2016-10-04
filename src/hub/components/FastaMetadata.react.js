import '../css/card.css';

import React from 'react';

import FastaCard from './FastaCard.react';

import { formatDay, formatMonth } from '../../utils/Date';

function displayDate({ day, month, year }) {
  if (!day && !month && !year) {
    return null;
  }
  return (
    <div className="wgsa-hub-card__metadata">
      <i title="Date" className="material-icons">date_range</i>
      <p>
        {day ? `${formatDay(day)} ` : ''}
        {month ? `${formatMonth(month)} ` : ''}
        {year || ''}
      </p>
    </div>
  );
}

function displayCountry(country) {
  if (!country || !country.name) return null;
  return (
    <div className="wgsa-hub-card__metadata">
      <i title="Country" className="material-icons">place</i>
      <p>{country.name}</p>
    </div>
  );
}

function displaySpecies(key, label) {
  if (!label) return null;
  return (
    <div className="wgsa-hub-card__metadata wgsa-hub-card__metadata--species">
      <i title="Species" className="material-icons">bug_report</i>
      <p title={key}>{label}</p>
    </div>
  );
}

export default
  ({ name, speciesKey, speciesLabel, metadata = {}, country }) => (
    <FastaCard name={name}>
      {displaySpecies(speciesKey, speciesLabel)}
      {displayCountry(country)}
      {displayDate(metadata)}
    </FastaCard>
  );
