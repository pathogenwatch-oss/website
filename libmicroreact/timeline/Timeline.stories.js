import React from 'react';

import Timeline from './index';
import AutoSizer from '../auto-sizer';

import reducer from './reducer';
import * as actions from './actions';

import exampleProps from './props';

export default {
  title: 'Visualisations/Timeline',
  decorators: [ story => <AutoSizer component={story} /> ],
};

const StoryTimeline = props => {
  // https://reactjs.org/docs/hooks-reference.html#specifying-the-initial-state
  const [ tl, dispatch ] = React.useReducer(reducer, { ...reducer(), ...props });
  // const dispatch = action => console.log(action) || _dispatch(action);

  const [ highlightedIds, setHighlightedIds ] = React.useReducer(
    (state, { ids, merge }) => {
      if (merge) {
        return new Set([ ...state, ...ids ]);
      }
      return new Set(ids);
    },
    new Set()
  );

  return (
    <Timeline
      {...props}
      bounds={tl.bounds}
      highlightedIds={highlightedIds}
      nodeSize={tl.nodeSize}
      onBoundsChange={value => dispatch(actions.setTimelineBounds(value))}
      onNodeSizeChange={value => dispatch(actions.setTimelineNodeSize(value))}
      onSpeedChange={value => dispatch(actions.setTimelineSpeed(value))}
      onUnitChange={value => dispatch(actions.setTimelineUnit(value))}
      onViewportChange={value => dispatch(actions.setTimelineViewport(value))}
      setHighlightedIds={(ids, merge) => setHighlightedIds({ ids, merge })}
      speed={tl.speed}
      unit={tl.unit}
    />
  );
};

export const Default = ({ width, height }) => (
  <StoryTimeline
    {...exampleProps}
    width={width}
    height={height}
  />
);
