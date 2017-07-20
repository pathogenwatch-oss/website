import React from 'react';

import Card from '../../card';
import ProgressBar from '../../progress-bar';

import Header from './Header.react';
import GenomeTasks from './GenomeTasks.react';
import GenomeError from './GenomeError.react';
import ErrorFooter from './ErrorFooter.react';

import { statuses } from '../constants';

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
        content: (
          <div>
            <ProgressBar progress={genome.progress} />
            <small>Uploading</small>
          </div>
        ),
      };
    case statuses.PENDING:
      return {
        content: <small>Pending</small>,
      };
    default:
      return {
        content: <GenomeTasks genome={genome} />,
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
