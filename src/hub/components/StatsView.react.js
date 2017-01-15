import '../css/stats.css';

import React from 'react';
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip,
} from 'recharts';
import { connect } from 'react-redux';

import ChartTooltip from '../../chart-tooltip';

import * as selectors from '../selectors/stats';

import { showGenomeDetails } from '../../genome-drawer';
import actions from '../actions';

const TooltipContent = ({ payload: [ index, genomeLength ], data }) => (
  <ChartTooltip
    heading={data[index.value].name}
    description="Genome Length"
    value={genomeLength.value}
  />
);

const charts = [
  { title: 'Genome Length', metric: 'totalNumberOfNucleotidesInDnaStrings' },
  { title: 'N50', metric: 'contigN50' },
  { title: 'No. Contigs', metric: 'totalNumberOfContigs' },
  { title: 'Non-ATCG', metric: 'totalNumberOfNsInDnaStrings' },
  { title: 'GC Content', metric: 'gcContent' },
];

const mapStateToButton = (state, ownProps) => {
  const selectedMetric = selectors.getSelectedMetric(state);

  return {
    className: selectedMetric === ownProps.metric ? 'active' : '',
  };
};

function mapDispatchToButton(dispatch, ownProps) {
  return {
    onClick: () => dispatch(actions.showMetric(ownProps.metric)),
  };
}

const ChartButton = connect(mapStateToButton, mapDispatchToButton)(
  ({ title, className, onClick }) => (
    <button className={className} onClick={onClick}>{title}</button>
  )
);

export const StatsView =
  ({ average, range = {}, chartData, onPointClick }) => (
      <div className="wgsa-hub-stats-view wgsa-content-margin-left">
        <div className="wgsa-hub-stats-section">
          <h2 className="wgsa-hub-stats-heading wgsa-hub-stats-heading--large">
            {charts.map(props =>
              <ChartButton key={props.metric} {...props} />
            )}
          </h2>
          <ResponsiveContainer height={320}>
            <ScatterChart
              margin={{ top: 16, bottom: 16, left: 0, right: 0 }}
              className="wgsa-selectable-chart"
            >
              <XAxis
                dataKey="key"
                name="name"
                tickFormatter={() => null}
                domain={[ -1, 'dataMax + 1' ]}
              />
              <YAxis
                dataKey="value"
                name="Genome Length"
                tickLine={false}
                domain={[ 0, Math.ceil(range.max * 1.25) ]}
              />
              <Scatter
                data={chartData}
                fill="#a386bd"
                isAnimationActive={false}
                className="wgsa-clickable-point"
                onClick={onPointClick}
              />
              <Tooltip
                cursor={{ stroke: 'none' }}
                offset={8}
                content={<TooltipContent data={chartData} />}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <dl className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
          <dt className="wgsa-hub-stats-heading">Average</dt>
          <dd className="wgsa-hub-stats-value wgsa-hub-stats-value--large">{average}</dd>
        </dl>
        <dl className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
          <dt className="wgsa-hub-stats-heading">Range</dt>
          <dd className="wgsa-hub-stats-value wgsa-hub-stats-value--large">
            {`${range.min} - ${range.max}`}
          </dd>
        </dl>
      </div>
    );

function mapStateToProps(state) {
  return {
    average: selectors.getMetricAverage(state),
    range: selectors.getMetricRange(state),
    chartData: selectors.getSelectedChartData(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPointClick: ({ name }) => dispatch(showGenomeDetails(name)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsView);
