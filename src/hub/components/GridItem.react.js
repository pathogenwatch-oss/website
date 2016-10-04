import React from 'react';

import ProgressBar from '../../components/ProgressBar.react';
import FastaMetadata from './FastaMetadata.react';
import FastaError from './FastaError.react';

function getProgressBar(progress) {
  return (
    progress === 100 ?
      <ProgressBar indeterminate /> :
      <ProgressBar progress={progress} />
  );
}

function getContent(props) {
  if (props.error) {
    return (<FastaError {...props} />);
  }

  if (props.speciesKey) {
    return (<FastaMetadata {...props} />);
  }

  return getProgressBar(props.progress);
}

export default props => {
  const name = props.metadata ? props.metadata.assemblyName : props.name;
  return (
    <article style={props.style}>
      <div className="wgsa-hub-card">
        <h2 className="wgsa-hub-card__title" title={name}>{name}</h2>
        { getContent(props) }
      </div>
    </article>
  );
};
