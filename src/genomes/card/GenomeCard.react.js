import React from 'react';

import Card from '../../card';
import ProgressBar from '../../progress-bar';

import GenomeMetadata from './GenomeMetadata.react';
import DefaultFooter from './DefaultFooter.react';
import GenomeError from './GenomeError.react';
import ErrorFooter from './ErrorFooter.react';
import AddToSelectionButton from './AddToSelectionButton.react';
import { FormattedSpeciesName } from '../../species';

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
  const { name, speciesId, speciesName } = props;
  const { content, footer = null } = getCardComponents(props);
  return (
    <Card className="wgsa-genome-card wgsa-card--bordered">
      <header className="wgsa-card-header">
        <h2 className="wgsa-card-title" title={name}>{name}</h2>
        <p className="wgsa-card-subtitle">
          { speciesName ?
            <FormattedSpeciesName
              speciesId={speciesId}
              title={speciesName}
              fullName
            /> : <span>&nbsp;</span> }
        </p>
        <span className="wgsa-card-header__button">
          <AddToSelectionButton genome={props} />
        </span>
      </header>
      { content }
      { footer }
    </Card>
  );
};
