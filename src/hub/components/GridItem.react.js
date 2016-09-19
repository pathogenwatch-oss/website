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
      <i className="material-icons">date_range</i>
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
    <div className="wgsa-hub-file__metadata">
      <i className="material-icons">place</i>
      <p>{country.name}</p>
    </div>
  );
}

function displayFastaData({ speciesLabel, metadata = {}, country }) {
  return (
    <div>
      <p>{speciesLabel}</p>
      <br />
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
