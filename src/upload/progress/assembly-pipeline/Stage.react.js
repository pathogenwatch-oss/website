import React from 'react';
import classnames from 'classnames';

import MultiProgress from '../../../components/MultiProgress.react';
import ProgressBar from '../../../components/progress-bar';
import Fade from '../../../components/fade';

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
    <header
      onClick={e => {
        e.stopPropagation();
        showDetails();
      }}
    >
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

export default Stage;
