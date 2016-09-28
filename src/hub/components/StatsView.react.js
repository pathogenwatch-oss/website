import '../css/stats.css';

import React from 'react';
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip,
} from 'recharts';
import { connect } from 'react-redux';

import { getVisibleFastas } from '../selectors';

const TooltipContent = ({ payload: [ index, assemblyLength ], data }) => (
  <div className="wgsa-chart-tooltip">
    <h3 className="wgsa-chart-tooltip__heading">{data[index.value].name}</h3>
    <dl>
      <dt>Assembly Length</dt>
      <dd>{assemblyLength.value}</dd>
    </dl>
  </div>
);

export const StatsView = React.createClass({

  render() {
    const { avg, data } = this.props;

    return (
      <div className="wgsa-hub__view wgsa-hub-gutter wgsa-hub-stats-view">
        <dl className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
          <dt className="wgsa-hub-stats-heading">Avg. Assembly Length</dt>
          <dd className="wgsa-hub-stats-bigstat">{avg.toFixed(0)}</dd>
        </dl>
        {/* <ResponsiveContainer height={320}>
        </ResponsiveContainer> */}
        <div className="wgsa-hub-stats-section">
          <h2 className="wgsa-hub-stats-heading">Assembly Length</h2>
          <ResponsiveContainer height={320}>
            <ScatterChart
              margin={{ top: 16, bottom: 16, left: 0, right: 0 }}
            >
              <XAxis dataKey="key" name="name" padding={{ left: 8, right: 0 }} tickFormatter={() => null} />
              <YAxis dataKey="value" name="Assembly Length" tickLine={false} />
              <Scatter data={data} fill="#a386bd" isAnimationActive={false} />
              <Tooltip
                cursor={{ stroke: 'transparent' }}
                offset={12}
                content={<TooltipContent data={data} />}
              />
            </ScatterChart>
          </ResponsiveContainer>
          {/* <TooltipContent items={data} payload={[ { value: 0 }, { value: data[0].value } ]} /> */}
        </div>
      </div>
    );
  },

});

function mapStateToProps(state) {
  const fastas = getVisibleFastas(state);
  const data =
  fastas.
    filter(_ => _.metrics).
    map(({ name, metrics }, i) => ({
      key: i,
      name,
      value: metrics.totalNumberOfNucleotidesInDnaStrings,
    }));

  return {
    data,
    avg: data.length ?
      data.reduce((memo, { value }) => memo + value, 0) / data.length : 0,
  };
}

export default connect(mapStateToProps)(StatsView);
