/* global Chart */

import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import { getChartData } from './selectors';

import { selectOrganism } from './actions';

function toggleOrganism(index, chart) {
  const [ sts, organisms ] = chart.config.data.datasets;
  const organismsMeta = chart.getDatasetMeta(1);
  const isSelected = organismsMeta.data[index].selected;
  for (const [ i, meta ] of organismsMeta.data.entries()) {
    meta.hidden = isSelected ? false : i !== index;
    meta.selected = i !== index ? false : !meta.selected;
  }
  const stMeta = chart.getDatasetMeta(0);
  for (let i = 0; i < sts.parents.length; i++) {
    stMeta.data[i].hidden = organismsMeta.data[sts.parents[i]].hidden;
  }
  chart.update();
  return organismsMeta.data[index].selected ? organisms.organismIds[index] : null;
}

const AnalysisChart = React.createClass({

  componentDidMount() {
    this.chart = new Chart(this.canvas, {
      type: 'doughnut',
      data: this.props.data,
      options: {
        pieceLabel: {
          mode: 'percentage',
          precision: 2,
          fontColor: '#fff',
          fontSize: 11,
          fontStyle: '500',
          fontFamily: 'Roboto',
        },
        responsive: true,
        animation: {
          animateRotate: true,
          animateScale: true,
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title: (points, { datasets }) =>
              points.map(({ index, datasetIndex }) =>
                datasets[datasetIndex].labels[index]
            ).join(', '),
            label: ({ index, datasetIndex }, { datasets }) =>
              datasets[datasetIndex].data[index],
          },
        },
        legend: {
          labels: {
            generateLabels: chart => {
              const organisms = chart.config.data.datasets[1];
              const meta = chart.getDatasetMeta(1);
              return organisms.labels.map((text, i) => ({
                fillStyle: organisms.backgroundColor[i],
                hidden: isNaN(organisms.data[i]) || meta.data[i].hidden,
                index: i,
                lineWidth: 2,
                strokeStyle: '#fff',
                text,
              }));
            },
          },
          onClick: (e, item) => this.toggleOrganism(item.index),
        },
        onClick: (e, [ item ]) => {
          if (!item) {
            const organismsMeta = this.chart.getDatasetMeta(1);
            const meta = organismsMeta.data.find(_ => _.selected);
            if (meta) {
              this.toggleOrganism(meta._index);
            }
            return;
          }
          if (item._datasetIndex === 0) {
            this.toggleOrganism(this.chart.data.datasets[0].parents[item._index]);
          } else {
            this.toggleOrganism(item._index);
          }
        },
      },
    });
  },

  componentDidUpdate() {
    const { datasets } = this.props.data;
    for (const dataset of datasets) {
      const current = this.chart.data.datasets.find(_ => _.label === dataset.label);
      if (current) {
        current.data = dataset.data;
        current.backgroundColor = dataset.backgroundColor;
        current.labels = dataset.labels;
        current.parents = dataset.parents;
      } else {
        this.chart.data.datasets.push(dataset);
      }
    }
    this.chart.update();
  },

  toggleOrganism(index) {
    const id = toggleOrganism(index, this.chart);
    this.props.selectOrganism(id);
  },

  render() {
    return (
      <div className="wgsa-analysis-chart">
        <canvas ref={el => { this.canvas = el; }} />
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    data: getChartData(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectOrganism: id => dispatch(selectOrganism(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisChart);
