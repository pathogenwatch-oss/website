/* global d3 */

import React from 'react';

export default React.createClass({

  componentDidMount() {
    const width = 960;
    const height = 700;
    const radius = (Math.min(width, height) / 2) - 10;

    const formatNumber = d3.format(',d');

    const x = d3.scale.linear().range([ 0, 2 * Math.PI ]);

    const y = d3.scale.sqrt().range([ 0, radius ]);

    const color = d3.scale.category20c();

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
        .style('fill', (d) => color((d.children ? d : d.parent).name))
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
