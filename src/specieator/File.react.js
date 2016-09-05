/* eslint "react/prop-types": 0 */

import React from 'react';

import ProgressBar from '../components/ProgressBar.react';

import { taxIdMap } from '^/species';

function displayContigs(count) {
  return (
    count === 1 ?
      '1 contig' :
      `${count} contigs`
  );
}

function fastaData(speciesId, speciesName, metrics) {
  const wgsaSpecies = taxIdMap.get(speciesId);
  return (
    <div>
      <p>{wgsaSpecies ? wgsaSpecies.formattedShortName : speciesName}</p>
      <p>{displayContigs(metrics.totalNumberOfContigs)}</p>
      <p>{metrics.gcContent}% GC content</p>
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

export default ({ name, progress, speciesId, speciesName, metrics }) => (
  <article className="mdl-cell wgsa-specieator-file">
    <h2 className="wgsa-specieator-file__title">{name}</h2>
    { speciesId ?
        fastaData(speciesId, speciesName, metrics) :
        getProgressBar(progress)
    }
  </article>
);
