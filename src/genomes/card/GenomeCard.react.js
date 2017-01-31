import React from 'react';

import Card from '../../card';
import ProgressBar from '../../components/progress-bar';

import GenomeMetadata from './GenomeMetadata.react';
import DefaultFooter from './DefaultFooter.react';

import GenomeError from './GenomeError.react';
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
      content: <GenomeError {...props} />,
      footer: <ErrorFooter {...props} />,
    };
  }

  if (props.speciesKey) {
    return {
      content: <GenomeMetadata {...props} />,
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
  const title = metadata ? metadata.name : name;
  const { content, footer = null } = getCardComponents(props);
  return (
    <Card className="wgsa-genome-card">
      <h2 className="wgsa-card-title" title={title}>{title}</h2>
      { content }
      { footer }
    </Card>
  );
};
