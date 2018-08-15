import React from 'react';

import Card from '../../card';
import ProgressBar from '../../components/progress-bar';

import Header from './Header.react';
import GenomeTasks from './GenomeTasks.react';
import GenomeError from './GenomeError.react';

import { statuses } from '../constants';

function getCardComponents(genome, analysis) {
  switch (genome.status) {
    case statuses.ERROR:
      return {
        content: <GenomeError genome={genome} />,
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
    case statuses.PENDING:
      return {
        content: (
          <div>
            <ProgressBar progress={genome.progress || 0} />
            <small>Uploading</small>
          </div>
        ),
      };
    case statuses.SUCCESS:
      return {
        content: <small>Succeeded 👍</small>,
      };
    default:
      return {
        content: <GenomeTasks analysis={analysis} />,
      };
  }
}


export default ({ item, analysis }) => {
  const { content, footer = null } = getCardComponents(item, analysis);
  return (
    <Card className="wgsa-genome-card">
      <Header genome={item} />
      { content }
      { footer }
    </Card>
  );
};
