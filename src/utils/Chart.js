import d3 from 'd3';

import { navigateToAssembly } from '^/utils/Navigation';

const tooltip = d3.select('body')
  .append('div')
  .style('position', 'absolute')
  .style('background', 'white')
  .style('border', '1px solid')
  .style('border-color', '#ccc')
  .style('padding', '10px')
  .style('z-index', '10')
  .style('display', 'none')
  .style('width', 'auto')
  .text('tooltip')
  .attr('class', 'mdl-card__supporting-text');

function drawN50Chart(chartData, assemblyN50, appendToClass) {
  if (!chartData) {
    return;
  }

  var className = appendToClass.replace(/^\./, '');
  var chartWidth = 0;
  if (document.getElementsByClassName(className)[0]) {
    chartWidth = document.getElementsByClassName(className)[0].parentElement.offsetWidth;
  }

  const chartHeight = 240;
  // Scales

  // X
  const xScale = d3.scale.linear()
    .domain([ 0, chartData.length ])
    .range([ 40, chartWidth - 100 ]); // the pixels to map, i.e. the width of the diagram

  // Y
  const yScale = d3.scale.linear()
    .domain([ chartData[chartData.length - 1], 0 ])
    .range([ 30, chartHeight - 52 ]);

  // Axes

  // X
  const xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(chartWidth / 40);

  // Y
  const yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    // http://stackoverflow.com/a/18822793
    .ticks(chartHeight / 40);

  d3.select('svg').remove();

  // Append SVG to DOM
  const svg = d3.select(appendToClass)
    .append('svg')
    .attr('width', '100%')
    .attr('height', chartHeight);

  // Append axis

  // X
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(20, 188)')
    .call(xAxis);

  // Y
  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(60, 0)')
    .call(yAxis);

  // Axis labels

  // X
  svg.select('.x.axis')
    .append('text')
    .text('No. Contigs (ordered by length)')
    .attr('class', 'axis-label')
    .attr('text-anchor', 'middle')
    .attr('x', (chartWidth / 2.5))
    .attr('y', 45);

  // Y
  svg.select('.y.axis')
    .append('text')
    .text('Assembly Length (nt)')
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(chartHeight / 2) - 44)
    .attr('y', chartWidth - 120);

  // Circles
  svg.selectAll('circle')
    .data(chartData)
    .enter()
    .append('circle')
    .attr('cx', function (datum, index) {
      return xScale(index + 1) + 20;
    })
    .attr('cy', function (datum) {
      return yScale(datum);
    })
    .attr('r', 5)
    .on('mouseover', function (datum) {
      return tooltip
        .style('top', (d3.event.pageY - 10) + 'px')
        .style('left', (d3.event.pageX + 10) + 'px')
        //.style('display', 'block')
        .html('Sum: <b>' + datum + '</b>');
    })
    .on('mousemove', function () {
      return tooltip
        .style('top', (d3.event.pageY - 10) + 'px')
        .style('left', (d3.event.pageX + 10) + 'px');
    })
    .on('mouseout', function () {
      return tooltip.style('display', 'none');
    });

  // Line
  const line = d3.svg.line()
    .x(function (datum, index) {
      return xScale(index + 1) + 20;
    })
    .y(function (datum) {
      return yScale(datum);
    });

  svg.append('path').attr('d', line(chartData));

  // Draw line from (0,0) to d3.max(data)
  const rootLineData = [ {
    'x': xScale(0) + 20,
    'y': yScale(0),
  }, {
    'x': xScale(1) + 20,
    'y': yScale(chartData[0]),
  } ];

  const rootLine = d3.svg.line()
    .x(function (datum) {
      return datum.x;
    })
    .y(function (datum) {
      return datum.y;
    })
    .interpolate('linear');

  svg.append('path').attr('d', rootLine(rootLineData));

  // Draw N50

  // Group circle and text elements
  const n50Group = svg.selectAll('.n50-circle')
    .data([ assemblyN50 ])
    .enter()
    .append('g')
    .attr('class', 'n50-group');

  // Append circle to group
  n50Group.append('circle')
    .attr('cx', function (datum) {
      return xScale(datum.sequenceNumber) + 20;
    })
    .attr('cy', function (datum) {
      return yScale(datum.sum);
    })
    .attr('r', 6)
    .attr('class', 'n50-circle')
    .on('mouseover', function (datum) {
      return tooltip
        .style('top', (d3.event.pageY - 10) + 'px')
        .style('left', (d3.event.pageX + 10) + 'px')
        //.style('display', 'block')
        .html('Sum: <b>' + datum.sum + '</b>' );
    })
    .on('mousemove', function () {
      return tooltip
        .style('top', (d3.event.pageY - 10) + 'px')
        .style('left', (d3.event.pageX + 10) + 'px');
    })
    .on('mouseout', function () {
      return tooltip.style('display', 'none');
    });

  // Append text to group
  n50Group.append('text')
    .attr('dx', function (datum) {
      return xScale(datum.sequenceNumber) + 20 + 9;
    })
    .attr('dy', function (datum) {
      return yScale(datum.sum) + 5;
    })
    .attr('text-anchor', 'right')
    .text('N50');

  // Draw N50 lines
  const d50LinesData = [ {
    'x': 54,
    'y': yScale(assemblyN50.sum),
  }, {
    'x': xScale(assemblyN50.sequenceNumber) + 20,
    'y': yScale(assemblyN50.sum),
  }, {
    'x': xScale(assemblyN50.sequenceNumber) + 20,
    'y': chartHeight - 46,
  } ];

  const d50Line = d3.svg.line()
    .x(function (datum) {
      return datum.x;
    })
    .y(function (datum) {
      return datum.y;
    })
    .interpolate('linear');

  // N50 path
  n50Group.append('path').attr('d', d50Line(d50LinesData));
  // console.log(assemblyN50)

  tooltip.style('display', 'none');
}

function drawOverviewChart(data, appendToClass, xLabel = '', yLabel = '') {

  if (!data) {
    return;
  }

  var className = appendToClass.replace(/^\./, '');
  var chartWidth = 0;
  if (document.getElementsByClassName(className)[0]) {
    chartWidth = document.getElementsByClassName(className)[0].parentElement.offsetWidth;
  }
  var chartHeight = 312;

  var chartData = [];
  for (const id in data) {
    if (data[id]) {
      chartData.push(data[id]);
    }
  }

  var chartXAxis = Object.keys(data);

  // Scales
  // console.log(chartData)
  // X
  var xScale = d3.scale.linear()
  .domain([ 0, chartData.length ])
  .range([ 40, chartWidth - 100 ]); // the pixels to map, i.e. the width of the diagram

  // Y
  var yScale = d3.scale.linear()
  .domain([ Math.max(...chartData) * 1.5, 0 ])
  .range([ 30, chartHeight - 52 ]);

  // Axes

  // X
  var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('bottom')
  .ticks(chartXAxis.length)
  .tickFormat(function (d) {return ''; });
  // Y
  var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left')
  // http://stackoverflow.com/a/18822793
  .ticks(10);

  // Append SVG to DOM
  var svg = d3.select(appendToClass)
  .append('svg')
  .attr('width', '100%')
  .attr('height', chartHeight);

  // Append axis

  // X
  svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(20, 260)')
  .call(xAxis);

  // Y
  svg.append('g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(60, 0)')
  .call(yAxis);

  // Axis labels

  // X
  svg.select('.x.axis')
  .append('text')
  .text(xLabel)
  .attr('class', 'axis-label')
  .attr('text-anchor', 'end')
  .attr('x', (chartWidth / 2))
  .attr('y', 45);

  // Y
  svg.select('.y.axis')
  .append('text')
  .text(yLabel)
  .attr('class', 'axis-label')
  .attr('transform', 'rotate(-90)')
  .attr('x', -(chartHeight / 2) - 44)
  .attr('y', chartWidth - 120);

  // Circles
  svg.selectAll('circle')
    .data(chartData)
    .enter()
    .append('circle')
    .attr('cx', function (datum, index) {
      return xScale(index + 1) + 20;
    })
    .attr('cy', function (datum) {
      return yScale(datum);
    })
    .attr('r', 5)
    .on('mouseover', function (datum, index) {
      return tooltip
        .style('top', (d3.event.pageY - 10) + 'px')
        .style('left', (d3.event.pageX + 10) + 'px')
        .style('display', 'block')
        .html('Assembly: <b>' + chartXAxis[index] + '</b><br>' + yLabel + ': <b>' + datum + '</b>');
    })
    .on('mousemove', function () {
      return tooltip
        .style('top', (d3.event.pageY - 10) + 'px')
        .style('left', (d3.event.pageX + 10) + 'px');
    })
    .on('mouseout', function () {
      return tooltip.style('display', 'none');
    })
    .on('click', function (datum, index) {
      navigateToAssembly(chartXAxis[index]);
      return tooltip.style('display', 'none');
    });

  tooltip.style('display', 'none');
}

export default {
  drawN50Chart,
  drawOverviewChart,
};
