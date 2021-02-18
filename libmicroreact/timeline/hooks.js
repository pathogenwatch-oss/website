import React from 'react';

import {
  createChartData,
  createHistogram,
  getInitialBounds,
  convertBoundsToMoments,
} from './utils';

export const useTimeline = (props) => {
  const { points, unit } = props;

  const chartData = React.useMemo(
    () => createChartData(points),
    [ points ]
  );

  const histogram = React.useMemo(
    () => createHistogram(points, unit),
    [ points, unit ]
  );

  const bounds = React.useMemo(
    () => props.bounds || getInitialBounds(histogram),
    [ props.bounds, histogram ]
  );

  const momentBounds = React.useMemo(
    () => convertBoundsToMoments(bounds, histogram),
    [ bounds, histogram ]
  );

  return {
    bounds,
    chartData,
    histogram,
    momentBounds,
  };
};
