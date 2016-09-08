/* eslint "react/prop-types": 0 */

import React from 'react';

import ProgressBar from '../../components/ProgressBar.react';

import { formatDay, formatMonth } from '../../utils/Date';

function displayContigs(count) {
  return (
    count === 1 ?
      '1 contig' :
      `${count} contigs`
  );
}

function displayDate({ day, month, year }) {
  if (!day && !month && !year) {
    return null;
  }
  return (
    <div className="wgsa-specieator-file__metadata">
      <i className="material-icons">date_range</i>
      <p>
        {day ? formatDay(day) : ''}
        {month ? formatMonth(month) : ''}
        {year || ''}
      </p>
    </div>
  );
}

function displayPosition({ latitude, longitude }) {
  if (!latitude && !longitude) return null;
  return (
    <div className="wgsa-specieator-file__metadata">
      <i className="material-icons">map_marker</i>
      <p>{latitude}, {longitude}</p>
    </div>
  );
}

// TODO: Parse user-defined cols to determine actual number
function displayMoreCols(metadata) {
  const moreCols = Object.keys(metadata).length - 8;
  if (moreCols <= 0) return null;
  return (
    <p><em>+ {moreCols} user-defined</em></p>
  );
}

function displayFastaData({ speciesLabel, metadata = {}, metrics }) {
  return (
    <div>
      <p>{speciesLabel}</p>
      <p>{displayContigs(metrics.totalNumberOfContigs)}</p>
      <p>{metrics.gcContent}% GC content</p>
      <br />
      {displayPosition(metadata)}
      {displayDate(metadata)}
      {displayMoreCols(metadata)}
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
  <article className="mdl-cell wgsa-specieator-file">
    <h2 className="wgsa-specieator-file__title">
      {props.metadata ? props.metadata.displayname : props.name}
    </h2>
    { typeof props.speciesId !== 'undefined' ?
        displayFastaData(props) :
        getProgressBar(props.progress)
    }
  </article>
);
