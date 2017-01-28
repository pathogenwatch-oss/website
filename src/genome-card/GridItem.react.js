import '../../card/styles.css';

import React from 'react';

import GenomeCard from '../../genome-card';
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

export default props => {
  if (props.error) {
    return (<FastaError {...props} />);
  }

  if (props.speciesKey) {
    return (<FastaMetadata {...props} />);
  }

  if (props.uploadAttempted) {
    return (
      <GenomeCard {...props}>
        { getProgressBar(props.progress) }
      </GenomeCard>
    );
  }

  return (
    <GenomeCard {...props}>
      <small>Upload pending</small>
    </GenomeCard>
  );
};
