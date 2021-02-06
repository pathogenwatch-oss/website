import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import TimelineChart from './TimelineChart.react';
import TimelineControls from './TimelineControls.react';
import AreaChart from '../area-chart';
import { PurePanel } from '../panel';

import { getTallestStack, formatLabel } from './utils';

const sliderHeight = 56;

const Timeline = ({ width, height, ...props }) => {
  const [ controlsVisible, setControlsVisible ] = React.useState(false);
  const tallestStack = React.useMemo(
    () => getTallestStack(props.chartData),
    [ props.chartData ]
  );
  return (
    <PurePanel
      className="libmr-Timeline"
      controlsVisible={controlsVisible}
      onControlsVisibleChange={setControlsVisible}
      secondaryControls={
        <TimelineControls
          bounds={props.bounds}
          nodeSize={props.nodeSize}
          onBoundsChange={props.onBoundsChange}
          onNodeSizeChange={props.onNodeSizeChange}
          onSpeedChange={props.onSpeedChange}
          onUnitChange={props.onUnitChange}
          speed={props.speed}
          timelineMax={props.histogram.length - 1}
          unit={props.unit}
        />
      }
      style={{ width, height }}
      zoomControls={false}
    >
      <TimelineChart
        addExportCallback={props.addExportCallback}
        bounds={props.momentBounds}
        chartData={props.chartData}
        getTooltip={props.getTooltip}
        height={height - sliderHeight}
        highlightedIds={props.highlightedIds}
        maxStackSize={tallestStack}
        nodeSize={props.nodeSize}
        onViewportChange={props.onViewportChange}
        removeExportCallback={props.removeExportCallback}
        setHighlightedIds={props.setHighlightedIds}
        styles={props.styles}
        unit={props.unit}
        viewport={props.viewport}
        width={width - 16}
      />
      <AreaChart
        bounds={props.bounds}
        chartData={props.histogram}
        formatLabel={formatLabel}
        height={sliderHeight - 8}
        onBoundsChange={props.onBoundsChange}
        width={width - 16}
        showLabels={controlsVisible}
      />
      {props.children}
    </PurePanel>
  );
};

Timeline.displayName = 'Timeline';

Timeline.propTypes = {
  addExportCallback: PropTypes.func,
  bounds: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }),
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.instanceOf(Date).isRequired,
      y: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  children: PropTypes.node,
  getTooltip: PropTypes.func,
  height: PropTypes.number.isRequired,
  highlightedIds: PropTypes.instanceOf(Set).isRequired,
  histogram: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.instanceOf(Date).isRequired,
      y: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  maxNodeSize: PropTypes.number,
  minNodeSize: PropTypes.number,
  momentBounds: PropTypes.shape({
    min: PropTypes.instanceOf(moment).isRequired,
    max: PropTypes.instanceOf(moment).isRequired,
  }).isRequired,
  nodeSize: PropTypes.number.isRequired,
  onBoundsChange: PropTypes.func.isRequired,
  onNodeSizeChange: PropTypes.func.isRequired,
  onSpeedChange: PropTypes.func.isRequired,
  onUnitChange: PropTypes.func.isRequired,
  onViewportChange: PropTypes.func.isRequired,
  removeExportCallback: PropTypes.func,
  setHighlightedIds: PropTypes.func.isRequired,
  speed: TimelineControls.propTypes.speed,
  styles: PropTypes.object.isRequired,
  unit: TimelineControls.propTypes.unit,
  viewport: PropTypes.shape({
    minx: PropTypes.number.isRequired,
    maxx: PropTypes.number.isRequired,
    miny: PropTypes.number.isRequired,
    maxy: PropTypes.number.isRequired,
  }).isRequired,
  width: PropTypes.number.isRequired,
};

Timeline.defaultProps = {
  getTooltip: point => point.id,
};

export default Timeline;
