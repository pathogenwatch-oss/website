import React from 'react';
import { connect } from 'react-redux';

import { AutoSizer } from 'react-virtualized';
import Slider, { createSliderWithTooltip } from 'rc-slider';

import { getThresholdMarks, getLocationThreshold } from './selectors';

import { updateQueryString } from '../location';

const padding = 16;

const SliderWithTooltip = createSliderWithTooltip(Slider);

const ThresholdSlider = ({ marks, currentThreshold }) => (
  <AutoSizer>
    {({ width }) => {
      const widthMinusPadding = width - (padding * 2);
      return (
        <div className="pw-cluster-threshold-slider wgsa-pane-overlay" style={{ width: widthMinusPadding }}>
          <h3>Set Threshold</h3>
          <SliderWithTooltip
            min={0}
            max={50}
            step={1}
            marks={marks}
            defaultValue={currentThreshold}
            included={false}
            onAfterChange={threshold => updateQueryString({ threshold })}
          />
        </div>
      );
    }}
  </AutoSizer>
);

function mapStateToProps(state) {
  return {
    currentThreshold: getLocationThreshold(state),
    marks: getThresholdMarks(state),
  };
}

export default connect(mapStateToProps)(ThresholdSlider);
