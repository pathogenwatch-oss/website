import '../../card/styles.css';

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

  if (props.uploadAttempted) {
    return getProgressBar(props.progress);
  }

  return (<small>Upload pending</small>);
}

export default props => {
  const name = props.metadata ? props.metadata.assemblyName : props.name;
  return (
    <article className="wgsa-card wgsa-assembly-card">
      <h2 className="wgsa-assembly-card-title" title={name}>{name}</h2>
      { getContent(props) }
    </article>
  );
};
