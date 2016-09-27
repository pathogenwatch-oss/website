import '../css/stats.css';

import React from 'react';
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip,
} from 'recharts';

const TooltipContent = ({ payload: [ index, assemblyLength ], items }) => (
  <div className="wgsa-chart-tooltip">
    <h3 className="wgsa-chart-tooltip__heading">{items[index.value].name}</h3>
    <dl>
      <dt>Assembly Length</dt>
      <dd>{assemblyLength.value}</dd>
    </dl>
  </div>
);

export default React.createClass({

  propTypes: {
    items: React.PropTypes.array,
  },

  render() {
    const { items } = this.props;
    const data =
      items.
        filter(_ => _.metrics).
        map(({ name, metrics }, i) => ({
          key: i,
          name,
          value: metrics.totalNumberOfNucleotidesInDnaStrings,
        }));
    const avg =
      data.length ?
        data.reduce((memo, { value }) => memo + value, 0) / data.length : 0;

    return (
      <div className="wgsa-hub-stats-view">
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
              data={data}
              margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
            >
              <XAxis dataKey="key" name="name" padding={{ left: 16, right: 0 }} tickFormatter={() => null} />
              <YAxis dataKey="value" name="Assembly Length" unit="nt" tickLine={false} />
              <Scatter data={data} fill="#a386bd" isAnimationActive={false} />
              <Tooltip
                cursor={{ stroke: 'transparent' }}
                offset={8}
                content={<TooltipContent items={data} />}
              />
            </ScatterChart>
          </ResponsiveContainer>
          {/* <TooltipContent items={data} payload={[ { value: 0 }, { value: data[0].value } ]} /> */}
        </div>
      </div>
    );
  },

});
