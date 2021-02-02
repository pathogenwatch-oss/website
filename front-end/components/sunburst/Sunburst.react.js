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

function getFillColour({ depth, data, parent }) {
  console.log(arguments);
  if (depth === 0) {
    return '#ffffff';
  }

  if (depth === 1) {
    return getColour(data.name);
  }

  return d3.hsl(getColour(parent.data.name)).brighter(0.5);
}

function getLabelText({ depth, data, parent }) {
  if (depth === 1) {
    return data.name;
  }

  return `${getLabelText(parent)}\n${data.name}`;
}

const width = 960;
const height = 700;
const radius = (Math.min(width, height) / 2) - 10;

const formatNumber = d3.format(',d');

const x = d3.scaleLinear()
    .range([ 0, 2 * Math.PI ]);

const y = d3.scaleSqrt()
    .range([ 0, radius ]);

// const partition = d3.partition();
window.partition = d3.partition();

const arc = d3.arc()
    .startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
    .endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
    .innerRadius(d => Math.max(0, y(d.y0)))
    .outerRadius(d => Math.max(0, y(d.y1)));

function arcTweenData(a, i) {
  // (a.x0s ? a.x0s : 0) -- grab the prev saved x0 or set to 0 (for 1st time through)
  // avoids the stash() and allows the sunburst to grow into being
  var oi = d3.interpolate({ x0: (a.x0s ? a.x0s : 0), x1: (a.x1s ? a.x1s : 0) }, a);
  function tween(t) {
    var b = oi(t);
    a.x0s = b.x0;
    a.x1s = b.x1;
    return arc(b);
  }
  if (i == 0) {
    // If we are on the first arc, adjust the x domain to match the root node
    // at the current zoom level. (We only need to do this once.)
    var xd = d3.interpolate(x.domain(), [root.x0, root.x1]);
    return function (t) {
      x.domain(xd(t));
      return tween(t);
    };
  } else {
    return tween;
  }
}

export default React.createClass({

  componentDidMount() {
    const svg = (
      d3.select(this.refs.chart).append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)
    );

    const root = d3.hierarchy(this.props.data);
    root.sum(d => d.size);
    window.root = root;
    svg.selectAll('path')
        .data(partition(root).descendants())
      .enter().append('path')
        .attr('d', arc)
        .style('fill', getFillColour)
        .on('click', d => {
          svg.transition()
              .duration(750)
              .tween('scale', () => {
                const xd = d3.interpolate(x.domain(), [ d.x0, d.x1 ]);
                const yd = d3.interpolate(y.domain(), [ d.y0, 1 ]);
                const yr = d3.interpolate(y.range(), [ d.y0 ? 20 : 0, radius ]);
                return t => { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
              })
            .selectAll('path')
              .attrTween('d', dd => function () { return arc(dd); });
        })
        .on('mouseover', d => {
          if (d.depth > 0) {
            this.label.text(getLabelText(d));
          }
        })
        .append('title')
        .text(d => `${d.data.name}\n${formatNumber(d.value)}`);

    this.label = svg.append('text').attr('transform', 'translate(0,0)');

    d3.select(self.frameElement).style('height', `${height}px`);

    window.svg = svg;
  },

  componentDidUpdate() {
    console.log(this.props);

    window.root = d3.hierarchy(this.props.data);
    root.sum(d => d.size);
    svg.selectAll('path')
        .data(partition(root).descendants())
        .transition().duration(1000).attrTween("d", arcTweenData);
  },

  render() {
    return <div className="wgsa-sunburst" ref="chart"></div>;
  },

});
