import React from 'react';

import Card from '../card';
import ProgressBar from '../components/ProgressBar.react';

import FastaMetadata from './FastaMetadata.react';
import DefaultFooter from './DefaultFooter.react';

import FastaError from './FastaError.react';
import ErrorFooter from './ErrorFooter.react';

function getProgressBar(progress) {
  return (
    progress === 100 ?
      <ProgressBar indeterminate /> :
      <ProgressBar progress={progress} />
  );
}

function getCardComponents(props) {
  if (props.error) {
    return {
      content: <FastaError {...props} />,
      footer: <ErrorFooter {...props} />,
    };
  }

  if (props.speciesKey) {
    return {
      content: <FastaMetadata {...props} />,
      footer: <DefaultFooter {...props} />,
    };
  }

  if (props.uploadAttempted) {
    return { content: getProgressBar(props.progress) };
  }

  return { content: <small>Upload pending</small> };
}

export default props => {
  const { name, metadata } = props;
  const title = metadata ? metadata.assemblyName : name;
  const { content, footer = null } = getCardComponents(props);
  return (
    <Card className="wgsa-assembly-card">
      <h2 className="wgsa-card-title" title={title}>{title}</h2>
      { content }
      { footer }
    </Card>
  );
};
