import React from 'react';
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip,
} from 'recharts';
import { connect } from 'react-redux';
import classnames from 'classnames';

import ChartTooltip from '../../chart-tooltip';

import * as selectors from './selectors';

import { showGenomeDrawer } from '../../genome-drawer';
import { showMetric } from './actions';

const TooltipContent = ({ payload }) => {
  if (!payload) return null;
  const [ index, metric ] = payload;
  return (
    <ChartTooltip
      heading={index.payload.name}
      description="value"
      value={metric.value}
    />
  );
};

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
    onClick: () => dispatch(showMetric(ownProps.metric)),
  };
}

const ChartButton = connect(mapStateToButton, mapDispatchToButton)(
  ({ title, className, onClick }) => (
    <button className={classnames('wgsa-button-group__item', className)} onClick={onClick}>
      {title}
    </button>
  )
);

export const StatsView =
  ({ average, stDev, range = {}, chartData, onPointClick }) => (
      <div className="wgsa-hub-stats-view">
        <div className="wgsa-hub-stats-section">
          <nav className="wgsa-button-group">
            <i title="Metric" className="material-icons">timeline</i>
            {charts.map(props =>
              <ChartButton key={props.metric} {...props} />
            )}
          </nav>
          <ResponsiveContainer height={208}>
            <ScatterChart
              margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
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
                name="metric"
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
                isAnimationActive={false}
                content={<TooltipContent />}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="wgsa-hub-stats-group">
          <dl className="wgsa-hub-stats-section">
            <dt className="wgsa-hub-stats-heading">Average</dt>
            <dd className="wgsa-hub-stats-value wgsa-hub-stats-value--large">{average}</dd>
          </dl>
          <dl className="wgsa-hub-stats-section">
            <dt className="wgsa-hub-stats-heading">Standard Deviation</dt>
            <dd className="wgsa-hub-stats-value wgsa-hub-stats-value--large">{stDev}</dd>
          </dl>
          <dl className="wgsa-hub-stats-section">
            <dt className="wgsa-hub-stats-heading">Range</dt>
            <dd className="wgsa-hub-stats-value wgsa-hub-stats-value--large">
              {`${range.min} - ${range.max}`}
            </dd>
          </dl>
        </div>
      </div>
    );

function mapStateToProps(state) {
  return {
    average: selectors.getMetricAverage(state),
    stDev: selectors.getMetricStDev(state),
    range: selectors.getMetricRange(state),
    chartData: selectors.getChartData(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPointClick: ({ id }) => dispatch(showGenomeDrawer(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsView);
