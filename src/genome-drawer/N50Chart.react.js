import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  // Tooltip,
} from 'recharts';

// import ChartTooltip from '../chart-tooltip';

// const TooltipContent = ({ payload }) =>
//   <ChartTooltip
//     heading="Sum"
//     value={payload.sum}
//   />;

export default React.createClass({

  render() {
    const { metrics } = this.props;
    const { sumsOfNucleotidesInDnaStrings, assemblyN50Data } = metrics;

    const data = sumsOfNucleotidesInDnaStrings.map(sum => ({ sum }));
    const n50Index = assemblyN50Data.sequenceNumber - 1;

    return (
      <LineChart
        width={540}
        height={320}
        data={data}
        margin={{ top: 16, right: 16, left: 16, bottom: 0 }}
      >
        <XAxis dataKey="name" tickFormatter={() => null} />
        <YAxis tickLine={false} />
        {/* <Tooltip
          cursor={{ stroke: 'none' }}
          offset={8}
          content={<TooltipContent />}
          isAnimationActive={false}
        /> */}
        <Line
          type="monotone"
          dataKey="sum"
          stroke="#673c90"
          dot={{ stroke: 'none', fill: '#a386bd', r: 4 }}
          isAnimationActive={false}
        />
        <ReferenceLine
          x={n50Index}
          label={`Contig ${assemblyN50Data.sequenceNumber}`}
          stroke="rgba(0, 0, 0, 0.54)"
          strokeDasharray="4 4"
        />
        <ReferenceLine
          y={assemblyN50Data.sum}
          stroke="rgba(0, 0, 0, 0.54)"
          strokeDasharray="4 4"
        />
      </LineChart>
    );
  },

});
