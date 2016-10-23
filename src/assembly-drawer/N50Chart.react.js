import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
} from 'recharts';

export default React.createClass({

  render() {
    const { metrics } = this.props;
    const { sumsOfNucleotidesInDnaStrings, assemblyN50Data } = metrics;

    const data = sumsOfNucleotidesInDnaStrings.map(sum => ({ sum }));
    return (
      <LineChart
        width={440}
        height={240}
        data={data}
        margin={{ top: 16, right: 8, left: 16, bottom: 16 }}
      >
       <XAxis dataKey="name" tickFormatter={() => null} />
       <YAxis tickLine={false} />
       <Tooltip />
       <Line type="monotone" dataKey="sum" stroke="#673c90" />
       <ReferenceLine x={assemblyN50Data.sequenceNumber - 1} label="N50" stroke="rgba(0, 0, 0, 0.54)" strokeDasharray="4 4" />
       <ReferenceLine y={assemblyN50Data.sum} stroke="rgba(0, 0, 0, 0.54)" strokeDasharray="4 4" />
      </LineChart>
    );
  },

});
