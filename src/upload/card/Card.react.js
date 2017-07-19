import React from 'react';

import Card from '../../card';
import ProgressBar from '../../progress-bar';

import Header from './Header.react';
import GenomeMetadata from '../../genomes/card/GenomeMetadata.react';
import GenomeError from './GenomeError.react';
import ErrorFooter from './ErrorFooter.react';

import { statuses } from '../constants';

function getProgressBar(progress) {
  return (
    progress === 100 ?
      <div>
        <ProgressBar indeterminate />
        <small>Estimating Organism</small>
      </div> :
      <div>
        <ProgressBar progress={progress} />
        <small>Uploading</small>
      </div>
  );
}

function getCardComponents(genome) {
  switch (genome.status) {
    case statuses.ERROR:
      return {
        content: <GenomeError genome={genome} />,
        footer: <ErrorFooter genome={genome} />,
      };
    case statuses.COMPRESSING:
      return {
        content: (
          <div>
            <ProgressBar indeterminate />
            <small>Compressing</small>
          </div>
        ),
      };
    case statuses.UPLOADING:
      return {
        content: getProgressBar(genome.progress),
      };
    case statuses.PENDING:
      return {
        content: <small>Pending</small>,
      };
    default:
      return {
        content: <GenomeMetadata genome={genome} />,
      };
  }
}

export default ({ item }) => {
  const { content, footer = null } = getCardComponents(item);
  return (
    <Card className="wgsa-genome-card wgsa-card--bordered">
      <Header genome={item} />
      { content }
      { footer }
    </Card>
  );
};
