import React from 'react';
import classnames from 'classnames';

import MultiProgress from '../../../components/MultiProgress.react';
import ProgressBar from '../../../components/progress-bar';

import Fade from '../../../components/fade';

const exampleData = {
  1: {
    label: 'Stage 1',
    statuses: [
      { name: 'Complete', colour: '#673c90', percentage: 40, count: 2 },
      { name: 'Running', colour: '#6cc2de', percentage: 20, count: 1 },
    ],
  },
};

const Details = ({ statuses = [] }) => (
  <div className="pw-assembly-pipeline-details mdl-shadow--2dp">
    {statuses.length ? (
      <table>
        <tbody>
          {statuses.map(status => (
            <tr>
              <td>
                <i className="material-icons" style={{ color: status.colour }}>
                  stop
                </i>
                <span>{status.name}</span>
              </td>
              <td>{status.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No progress</p>
    )}
  </div>
);

const Stage = ({
  children,
  length,
  progress,
  statuses,
  showDetails,
  showingDetails,
}) => (
  <div className={classnames('pw-assembly-pipeline-stage', length)}>
    <Fade out>{showingDetails && <Details statuses={statuses} />}</Fade>
    <header onClick={showDetails}>
      <MultiProgress
        radius="32"
        strokeWidth="8"
        segments={statuses}
        progress={progress}
      />
      <p>{children}</p>
    </header>
    <ProgressBar progress={progress} />
  </div>
);

export default () => {
  const [ stage, setStageDetail ] = React.useState(null);
  return (
    <div className="pw-assembly-pipeline">
      <Stage
        statuses={exampleData[1].statuses}
        progress={40}
        showDetails={() => setStageDetail('1')}
        showingDetails={stage === '1'}
      >
        Stage 1
      </Stage>
      <Stage
        showDetails={() => setStageDetail('2')}
        showingDetails={stage === '2'}
      >
        Stage 2
      </Stage>
      <Stage
        showDetails={() => setStageDetail('3')}
        showingDetails={stage === '3'}
      >
        Stage 3
      </Stage>
      <Stage>Stage 4</Stage>
      <Stage length="long">Stage 5</Stage>
    </div>
  );
};
