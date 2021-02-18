import './Timeline.css';

import React from 'react';
import PropTypes from 'prop-types';

import PureTimeline from './Timeline.react';

import { useTimeline } from './hooks';

const Timeline = props => {
  const timeline = useTimeline(props);
  return <PureTimeline {...props} {...timeline} />;
};

Timeline.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.instanceOf(Date).isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  styles: PropTypes.object.isRequired,
};

export { PureTimeline };

export default Timeline;
