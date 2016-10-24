import '../../card/styles.css';

import React from 'react';

import AssemblyCard from '../../assembly-card';
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
      <AssemblyCard {...props}>
        { getProgressBar(props.progress) }
      </AssemblyCard>
    );
  }

  return (
    <AssemblyCard {...props}>
      <small>Upload pending</small>
    </AssemblyCard>
  );
};
