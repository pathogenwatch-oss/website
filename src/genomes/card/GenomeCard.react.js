import React from 'react';

import Card from '../../card';
import ProgressBar from '../../progress-bar';

import GenomeMetadata from './GenomeMetadata.react';
import DefaultFooter from './DefaultFooter.react';

import GenomeError from './GenomeError.react';
import ErrorFooter from './ErrorFooter.react';

import { statuses } from '../uploads/constants';

function getProgressBar(progress) {
  return (
    progress === 100 ?
      <ProgressBar indeterminate /> :
      <ProgressBar progress={progress} />
  );
}

function getCardComponents(props) {
  switch (props.status) {
    case statuses.ERROR:
      return {
        content: <GenomeError {...props} />,
        footer: <ErrorFooter {...props} />,
      };
    case statuses.UPLOADING:
      return {
        content: getProgressBar(props.progress),
      };
    case statuses.PENDING:
      return {
        content: <small>Upload pending</small>,
      };
    default:
      return {
        content: <GenomeMetadata {...props} />,
        footer: <DefaultFooter {...props} />,
      };
  }
}

export default props => {
  const { name, reference } = props;
  const { content, footer = null } = getCardComponents(props);
  return (
    <Card className="wgsa-genome-card wgsa-card--bordered">
      <h2 className="wgsa-card-title" title={name}>{name}</h2>
      { reference &&
        <span className="wgsa-genome-card__badge mdl-chip__contact" title="Reference Genome">R</span>
      }
      { content }
      { footer }
    </Card>
  );
};
