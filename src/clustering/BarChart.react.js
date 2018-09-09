/* global Chart */

import React, { Component } from 'react';

import ChartResizer from '../components/chart-resizer';

class SimpleBarChart extends Component {
  componentDidMount() {
    const {
      labels = [],
      values = [],
      backgroundColor = '#b199c7',
      hoverBackgroundColor = '#673c90',
      toolTipFunc = null,
    } = this.props;

    const tooltips = toolTipFunc === null ? undefined : {
      callbacks: {
        label: toolTipFunc,
        title: () => '',
      },
    };

    const ctx = this.canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [ {
          backgroundColor,
          hoverBackgroundColor,
          borderWidth: 0,
          data: values,
        } ],
      },
      options: {
        responsive: false,
        legend: {
          display: false,
        },
        scales: {
          xAxes: [ {
            barPercentage: 1,
            categoryPercentage: 0.9,
            ticks: {
              maxTicksLimit: 10,
            },
          } ],
          yAxes: [ {
            ticks: {
              beginAtZero: true,
              display: false,
            },
          } ],
        },
        tooltips,
      },
    });
  }

  componentDidUpdate() {
    const {
      labels = [],
      values = [],
      backgroundColor,
      hoverBackgroundColor,
    } = this.props;

    const dataset = this.chart.data.datasets[0];
    dataset.data = values;
    dataset.backgroundColor = backgroundColor;
    dataset.hoverBackgroundColor = hoverBackgroundColor;
    this.chart.data.labels = labels;

    this.chart.update();
  }

  onClick(e) {
    const chartElements = this.chart.getElementsAtEvent(e);
    let label;
    let value;
    try {
      const target = chartElements[0];
      const { _index: dataIndex } = target;
      label = this.chart.data.labels[dataIndex];
      value = this.chart.data.datasets[0].data[dataIndex];
    } catch (err) {
      return null;
    }
    return this.props.onClick({ label, value });
  }

  render() {
    return (
      <ChartResizer
        width={this.props.width}
        height={this.props.height}
        chart={this.chart}
      >
        <canvas onClick={(e) => this.onClick(e)} ref={el => { this.canvas = el; }} />;
      </ChartResizer>
    );
  }
}

export default SimpleBarChart;
