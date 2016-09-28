import '../css/stats.css';

import React from 'react';
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip,
} from 'recharts';
import { connect } from 'react-redux';

import * as selectors from '../selectors/stats';

import actions from '../actions';

const TooltipContent = ({ payload: [ index, assemblyLength ], data }) => (
  <div className="wgsa-chart-tooltip">
    <h3 className="wgsa-chart-tooltip__heading">{data[index.value].name}</h3>
    <dl>
      <dt>Assembly Length</dt>
      <dd>{assemblyLength.value}</dd>
    </dl>
  </div>
);

const charts = [
  { title: 'Assembly Length', metric: 'totalNumberOfNucleotidesInDnaStrings' },
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
  ({ average, range = {}, chartData }) => (
      <div className="wgsa-hub-stats-view wgsa-hub-gutter-left">
        <div className="wgsa-hub-stats-section">
          <h2 className="wgsa-hub-stats-heading">
            {charts.map(props =>
              <ChartButton key={props.metric} {...props} />
            )}
          </h2>
          <ResponsiveContainer height={320}>
            <ScatterChart
              margin={{ top: 16, bottom: 16, left: 0, right: 0 }}
            >
              <XAxis dataKey="key" name="name" padding={{ left: 8, right: 8 }} tickFormatter={() => null} />
              <YAxis dataKey="value" name="Assembly Length" tickLine={false} />
              <Scatter data={chartData} fill="#a386bd" isAnimationActive={false} />
              <Tooltip
                cursor={{ stroke: 'transparent' }}
                offset={12}
                content={<TooltipContent data={chartData} />}
              />
            </ScatterChart>
          </ResponsiveContainer>
          {/* <TooltipContent items={data} payload={[ { value: 0 }, { value: data[0].value } ]} /> */}
        </div>
        <dl className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
          <dt className="wgsa-hub-stats-heading">Average</dt>
          <dd className="wgsa-hub-stats-bigstat">{average}</dd>
        </dl>
        <dl className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
          <dt className="wgsa-hub-stats-heading">Range</dt>
          <dd className="wgsa-hub-stats-bigstat">
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

export default connect(mapStateToProps)(StatsView);
