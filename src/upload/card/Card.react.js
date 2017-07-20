import React from 'react';
import { connect } from 'react-redux';

import Card from '../../card';
import ProgressBar from '../../progress-bar';

import Header from './Header.react';
import GenomeTasks from './GenomeTasks.react';
import GenomeError from './GenomeError.react';
import ErrorFooter from './ErrorFooter.react';

import { getAnalyses } from '../selectors';

import { statuses } from '../constants';

function getCardComponents(genome, analysis) {
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
        content: <GenomeTasks analysis={analysis} />,
      };
  }
}

function mapStateToProps(state, { item }) {
  return {
    analysis: getAnalyses(state)[item.genomeId],
  };
}

export default connect(mapStateToProps)(
  ({ item, analysis }) => {
    const { content, footer = null } = getCardComponents(item, analysis);
    return (
      <Card className="wgsa-genome-card wgsa-card--bordered">
        <Header genome={item} analysis={analysis} />
        { content }
        { footer }
      </Card>
    );
  }
);
