import React from 'react';

import ProgressBar from '../../components/progress-bar';

import Header from './Header.react';
import GenomeError from './GenomeError.react';

import { statuses, types } from '../constants';

const stages = {
  IDENTIFY: 'Identifying',
  PREPARE: 'Preparing',
  UPLOAD: 'Uploading',
};

function renderReadsProgress(genome) {
  return Object.values(genome.files).map(file => (
    <React.Fragment key={file.name}>
      <ProgressBar key={file.stage} progress={file.progress || 0} />
      <small>{stages[file.stage] || 'Pending'}</small>
    </React.Fragment>
  ));
}

function renderAssemblyProgress(genome) {
  switch (genome.status) {
    case statuses.ERROR:
      return <GenomeError genome={genome} />;
    case statuses.COMPRESSING:
      return (
        <React.Fragment>
          <ProgressBar indeterminate />
          <small>Compressing</small>
        </React.Fragment>
      );
    case statuses.UPLOADING:
    case statuses.PENDING:
      return (
        <React.Fragment>
          <ProgressBar progress={genome.progress || 0} />
          <small>Uploading</small>
        </React.Fragment>
      );
    case statuses.SUCCESS:
      return <small>Succeeded 👍</small>;
    default:
      return null;
  }
}

export default ({ item }) => {
  const content =
    item.type === types.READS
      ? renderReadsProgress(item)
      : renderAssemblyProgress(item);
  return (
    <div className="wgsa-genome-card">
      <Header genome={item} />
      {content}
    </div>
  );
};
