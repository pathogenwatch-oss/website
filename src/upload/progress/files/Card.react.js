import React from 'react';

import ProgressBar from '~/components/progress-bar';
import Error from './CardError.react';

import { statuses, types } from './constants';

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
      return <Error genome={genome} />;
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

export default ({ genome }) => (
  <div className="wgsa-genome-card">
    <header className="wgsa-card-header">
      <h2 className="wgsa-card-title wgsa-overflow-fade" title={genome.name}>
        {genome.name}
      </h2>
    </header>
    {genome.type === types.READS
      ? renderReadsProgress(genome)
      : renderAssemblyProgress(genome)}
  </div>
);
