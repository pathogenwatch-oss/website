/* global Chart */

import React from 'react';

import addGuideLinesPlugin from '../../../cgps-commons/ChartJSGuidelinePlugin';
addGuideLinesPlugin(Chart);

export default React.createClass({

  componentDidMount() {
    const { metrics } = this.props;
    const { contigSums, N50Contig } = metrics;
    const chartData = {
      label: 'N50',
      backgroundColor: '#a386bd',
      fill: false,
      pointBorderColor: '#a386bd',
      // lineColor: 'rgba(0, 0, 0, 0.54)',
      data: [ { x: 0, y: 0 } ].concat(
        contigSums.map((y, x) => ({ x: x + 1, y }))
      ),
    };

    this.chart = new Chart(this.canvas, {
      type: 'line',
      data: { datasets: [ chartData ] },
      options: {
        animation: false,
        responsive: false,
        legend: {
          display: false,
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title: (points, { datasets }) =>
              'Sum: '.concat(
                points.map(({ index, datasetIndex }) =>
                  datasets[datasetIndex].data[index].y
                ).join(', ')
              ),
            label: ({ index, datasetIndex }, { datasets }) =>
              `Size: ${datasets[datasetIndex].data[index].y - (index > 0 ? datasets[datasetIndex].data[index - 1].y : 0)}`,
          },
        },
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom',
              ticks: {
                display: false,
                max: contigSums.length + 1,
              },
              scaleLabel: { display: false },
              beginAtZero: true,
              gridLines: { display: false },
            },
          ],
          yAxes: [
            {
              gridLines: { display: false },
            },
          ],
        },
        horizontalLine: [ {
          y: metrics.length / 2,
          style: '#3c7383',
          text: metrics.length / 2,
          dash: true,
        } ],
        verticalLine: [ {
          x: N50Contig,
          style: '#ccc',
          dash: true,
          text: `Contig ${N50Contig}`,
          textStyle: 'rgba(0, 0, 0, 0.54)',
        } ],
      },
    });
  },

  render() {
    return (
      <canvas ref={el => { this.canvas = el; }} width="640" height="320" />
    );
  },

});
