/* global Chart */

import React, { Component } from 'react';

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
    } = this.props;

    const dataset = this.chart.data.datasets[0];
    dataset.data = values;
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
    return <canvas onClick={(e) => this.onClick(e)} ref={ el => { this.canvas = el; } } width={ this.props.width } height={ this.props.height } />;
  }
}

export default SimpleBarChart;
