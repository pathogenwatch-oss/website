import React from 'react';

import { CardMetadata } from '../../card';

const ignoredTasks = new Set([ 'specieator', 'metrics' ]);

function showResult(task, result) {
  switch (task) {
    case 'mlst':
      return `ST${result.st || ' -'}`;
    default:
      return task;
  }
}

function TaskStatus({ task, result }) {
  if (ignoredTasks.has(task)) return null;

  const icon = result === null ?
    'hourglass_empty' : 'check_circle';

  return (
    <CardMetadata
      icon={icon}
      title={result ? `Version ${result.__v}` : null}
    >
      {result ? showResult(task, result) : task}
    </CardMetadata>
  );
}

export default ({ genome }) => {
  const { analysis } = genome;
  if (!analysis) return null;
  return (
    <div className="wgsa-card-content">
      { Object.keys(analysis).map(task =>
          <TaskStatus key={task} task={task} result={analysis[task]} />
        )
      }
    </div>
  );
};
