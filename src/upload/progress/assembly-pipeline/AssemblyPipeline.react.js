import React from 'react';
import classnames from 'classnames';

import CircularProgress from '../../../components/CircularProgress.react';
import ProgressBar from '../../../components/progress-bar';

const Stage = ({ children, length }) => (
  <div className={classnames('pw-assembly-pipeline-stage', length)}>
    <header>
      <CircularProgress radius="32" strokeWidth="8" percentage={0} />
      <p>{children}</p>
    </header>
    <ProgressBar progress={0} />
  </div>
);

export default () => (
  <div className="pw-assembly-pipeline">
    <Stage>Stage 1</Stage>
    <Stage>Stage 2</Stage>
    <Stage>Stage 3</Stage>
    <Stage>Stage 4</Stage>
    <Stage length="long">Stage 5</Stage>
  </div>
);
