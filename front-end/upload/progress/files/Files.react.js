import React from 'react';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

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
    {uploadsInProgress.length > 0 && pending > 0 && (
      <p>
        +{pending} genome{pending === 1 ? '' : 's'}
      </p>
    )}
  </React.Fragment>
);
