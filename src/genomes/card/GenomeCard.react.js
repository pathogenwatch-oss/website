import React from 'react';

import Card from '../../card';
import ProgressBar from '../../progress-bar';

import GenomeMetadata from './GenomeMetadata.react';
import DefaultFooter from './DefaultFooter.react';
import GenomeError from './GenomeError.react';
import ErrorFooter from './ErrorFooter.react';
import AddToSelectionButton from './AddToSelectionButton.react';
import { FormattedName } from '../../organisms';

import { statuses } from '../uploads/constants';

function getProgressBar(progress) {
  return (
    progress === 100 ?
      <ProgressBar indeterminate /> :
      <ProgressBar progress={progress} />
  );
}

function getCardComponents(genome) {
  switch (genome.status) {
    case statuses.ERROR:
      return {
        content: <GenomeError genome={genome} />,
        footer: <ErrorFooter genome={genome} />,
      };
    case statuses.UPLOADING:
      return {
        content: getProgressBar(genome.progress),
      };
    case statuses.PENDING:
      return {
        content: <small>Upload pending</small>,
      };
    default:
      return {
        content: <GenomeMetadata genome={genome} />,
        footer: <DefaultFooter genome={genome} />,
      };
  }
}

export default ({ item }) => {
  const { name, organismId, organismName } = item;
  const { content, footer = null } = getCardComponents(item);
  return (
    <Card className="wgsa-genome-card wgsa-card--bordered">
      <header className="wgsa-card-header">
        <h2 className="wgsa-card-title" title={name}>{name}</h2>
        <p className="wgsa-card-subtitle">
          { organismName ?
              <FormattedName
                organismId={organismId}
                title={organismName}
                fullName
              /> :
              <span>&nbsp;</span> }
        </p>
        <span className="wgsa-card-header__button">
          <AddToSelectionButton genome={item} />
        </span>
      </header>
      { content }
      { footer }
    </Card>
  );
};
