/* global d3 */

import React from 'react';

const colours = [
  '#834B96',
  '#B668A6',
  '#756E94',
  '#97B5BE',
  '#92A3B8',
  '#E8E0EE',
  '#BFABCF',
  '#CFC1DB',
  '#9070AC',
  '#A389BB',
  '#8968A7',
  '#9D81B6',
];

const colourMap = new Map();
let usedColours = 0;

function getColour(name) {
  if (!colourMap.has(name)) {
    const newColour = colours[(usedColours++) % colours.length];
    colourMap.set(name, newColour);
  }

  return colourMap.get(name);
}

function getFillColour({ depth, name, parent }) {
  if (depth === 0) {
    return '#ffffff';
  }

  if (depth === 1) {
    return getColour(name);
  }

  return d3.hsl(getColour(parent.name)).brighter(0.5);
}

export default React.createClass({

  componentDidMount() {
    const width = 960;
    const height = 700;
    const radius = (Math.min(width, height) / 2) - 10;

    const formatNumber = d3.format(',d');

    const x = d3.scale.linear().range([ 0, 2 * Math.PI ]);

    const y = d3.scale.sqrt().range([ 0, radius ]);

    // const color = d3.scale.category20();

    const partition = d3.layout.partition().value(d => d.size);

    const arc = d3.svg.arc()
      .startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x))))
      .endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))))
      .innerRadius(d => Math.max(0, y(d.y)))
      .outerRadius(d => Math.max(0, y(d.y + d.dy)));

    const svg = (
      d3.select(this.refs.chart).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)
    );

    this.path = (
      svg.selectAll('path')
        .data(partition.nodes(this.props.data))
        .enter().append('path')
        .attr('d', arc)
        .attr('class', (d, i) => `arc-depth-${d.depth}`)
        .style('fill', getFillColour)
        .on('click', d => {
          this.svg.transition()
            .duration(750)
            .tween('scale', () => {
              const xd = d3.interpolate(x.domain(), [ d.x, d.x + d.dx ]);
              const yd = d3.interpolate(y.domain(), [ d.y, 1 ]);
              const yr = d3.interpolate(y.range(), [ d.y ? 20 : 0, radius ]);
              return function (t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
            })
          .selectAll('path')
            .attrTween('d', dd => function () { return arc(dd); });
        })
        .append('title')
        .text(d => `${d.name}\n${formatNumber(d.value)}`)
      );

    d3.select(self.frameElement).style('height', `${height}px`);

    this.svg = svg;
  },

  componentDidUpdate() {
    this.svg.transition().duration(750);
  },

  render() {
    return <div className="wgsa-sunburst" ref="chart"></div>;
  },

});
