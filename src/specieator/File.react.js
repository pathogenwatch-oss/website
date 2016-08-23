/* eslint "react/prop-types": 0 */

import React from 'react';

import ProgressBar from '../components/ProgressBar.react';

import { taxIdMap } from '^/species';

function fastaData(speciesId, speciesName, metrics) {
  const wgsaSpecies = taxIdMap.get(speciesId);
  return (
    <div>
      <p>{wgsaSpecies ? wgsaSpecies.formattedShortName : speciesName}</p>
      <span>{metrics.totalNumberOfContigs} contigs, {metrics.gcContent}% GCs</span>
    </div>
  );
}

export default ({ name, progress, speciesId, speciesName, metrics }) => (
  <article className="mdl-cell wgsa-specieator-file">
    <h2 className="wgsa-specieator-file__title">{name}</h2>
    { speciesId ?
        fastaData(speciesId, speciesName, metrics) :
        <ProgressBar progress={progress} /> }
  </article>
);
