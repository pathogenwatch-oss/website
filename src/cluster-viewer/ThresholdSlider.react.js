import React from 'react';
import { connect } from 'react-redux';

import { AutoSizer } from 'react-virtualized';
import Slider, { createSliderWithTooltip } from 'rc-slider';

import { getThresholdMarks, getLocationThreshold } from './selectors';
import { getNumberOfGenomesAtThreshold } from '../clustering/selectors';

import { updateQueryString } from '../location';

const SliderWithTooltip = createSliderWithTooltip(Slider);

const ThresholdSlider = ({ marks, currentThreshold, genomeTotals = [] }) => (
  <AutoSizer>
    {({ width }) => (
      <div className="pw-cluster-threshold-slider wgsa-pane-overlay" style={{ width }}>
        <h3>Set Threshold</h3>
        <SliderWithTooltip
          min={0}
          max={marks.max}
          step={1}
          marks={marks.items}
          defaultValue={currentThreshold}
          included={false}
          onAfterChange={threshold => updateQueryString({ threshold })}
          tipFormatter={t => `${genomeTotals[t]} genomes at threshold ${t}`}
        />
      </div>
    )}
  </AutoSizer>
);

function mapStateToProps(state) {
  return {
    genomeTotals: getNumberOfGenomesAtThreshold(state),
    currentThreshold: getLocationThreshold(state),
    marks: getThresholdMarks(state),
  };
}

export default connect(mapStateToProps)(ThresholdSlider);
