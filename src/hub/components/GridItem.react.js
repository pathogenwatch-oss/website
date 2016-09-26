/* eslint "react/prop-types": 0 */

import React from 'react';

import ProgressBar from '../../components/ProgressBar.react';

import { formatDay, formatMonth } from '../../utils/Date';

function displayDate({ day, month, year }) {
  if (!day && !month && !year) {
    return null;
  }
  return (
    <div className="wgsa-hub-card__metadata">
      <i title="Date" className="material-icons">date_range</i>
      <p>
        {day ? formatDay(day) : ''}
        {month ? formatMonth(month) : ''}
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

function displayFastaData({ speciesKey, speciesLabel, metadata = {}, country }) {
  return (
    <div className="wgsa-hub-card__content">
      {displaySpecies(speciesKey, speciesLabel)}
      {displayCountry(country)}
      {displayDate(metadata)}
    </div>
  );
}

function getProgressBar(progress) {
  return (
    progress === 100 ?
      <ProgressBar indeterminate /> :
      <ProgressBar progress={progress} />
  );
}

export default props => (
  <article style={props.style}>
    <div className="wgsa-hub-card">
      <h2 className="wgsa-hub-card__title">
        {props.metadata ? props.metadata.displayname : props.name}
      </h2>
      { typeof props.speciesId !== 'undefined' ?
          displayFastaData(props) :
          getProgressBar(props.progress)
      }
    </div>
  </article>
);
