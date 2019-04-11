import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import FileCard from './Card.react';

export default ({ uploadsInProgress, pending }) => (
  <React.Fragment>
    <ReactCSSTransitionGroup
      className="wgsa-upload-card-list"
      transitionName="wgsa-upload-card"
      transitionEnterTimeout={280}
      transitionLeave={false}
    >
      {uploadsInProgress.map(genome => (
        <FileCard key={genome.id} genome={genome} />
      ))}
    </ReactCSSTransitionGroup>
    {pending > 0 && (
      <p>
        +{pending} genome{pending === 1 ? '' : 's'}.
      </p>
    )}
  </React.Fragment>
);
