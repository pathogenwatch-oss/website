/* eslint "react/prop-types": 0 */

import React from 'react';

import ProgressBar from '../../components/ProgressBar.react';

import { formatDay, formatMonth } from '../../utils/Date';

function displayDate({ day, month, year }) {
  if (!day && !month && !year) {
    return null;
  }
  return (
    <div className="wgsa-hub-file__metadata">
      <p>
        {day ? formatDay(day) : ''}
        {month ? formatMonth(month) : ''}
        {year || ''}
      </p>
      <i title="Date" className="material-icons">date_range</i>
    </div>
  );
}

function displayCountry(country) {
  if (!country || !country.name) return null;
  return (
    <div className="wgsa-hub-file__metadata">
      <p>{country.name}</p>
      <i title="Country" className="material-icons">place</i>
    </div>
  );
}

function displaySpecies(label) {
  if (!label) return null;
  return (
    <div className="wgsa-hub-file__metadata wgsa-hub-file__metadata--species">
      <p>{label}</p>
      <i title="Species" className="material-icons">bug_report</i>
    </div>
  );
}

function displayFastaData({ speciesLabel, metadata = {}, country }) {
  return (
    <div>
      {displaySpecies(speciesLabel)}
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
  <article className="mdl-cell wgsa-hub-file">
    <h2 className="wgsa-hub-file__title">
      {props.metadata ? props.metadata.displayname : props.name}
    </h2>
    { typeof props.speciesId !== 'undefined' ?
        displayFastaData(props) :
        getProgressBar(props.progress)
    }
  </article>
);
