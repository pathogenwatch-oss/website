import React from 'react';

import ProgressBar from '../../components/ProgressBar.react';
import FastaCard from './FastaCard.react';

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
          <FastaCard {...props} /> :
          getProgressBar(props.progress)
      }
    </div>
  </article>
);
