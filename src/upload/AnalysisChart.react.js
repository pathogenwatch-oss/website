/* global Chart */

import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

// import Sunburst from '../components/sunburst';
import * as upload from './selectors';

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
  if (name === 'Pending') return '#ccc';

  if (!colourMap.has(name)) {
    const newColour = colours[(usedColours++) % colours.length];
    colourMap.set(name, newColour);
  }

  return colourMap.get(name);
}

const AnalysisChart = React.createClass({

  componentDidMount() {
    this.chart = new Chart(this.canvas, {
      type: 'doughnut',
      data: this.props.data,
      options: {
        responsive: true,
        animation: {
          animateRotate: false,
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
          onClick: (e, legendItem) => {
            const index = legendItem.index;
            const chart = this.chart;
            const [ sts ] = chart.config.data.datasets;
            const organismsMeta = chart.getDatasetMeta(1);
            if (organismsMeta.data[index]) {
              organismsMeta.data[index].hidden = !organismsMeta.data[index].hidden;
            }
            const stMeta = chart.getDatasetMeta(0);
            for (let i = 0; i < sts.parents.length; i++) {
              if (sts.parents[i] === index) {
                stMeta.data[i].hidden = !stMeta.data[i].hidden;
              }
            }
            chart.update();
          },
        },
      },
    });
  },

  componentDidUpdate() {
    const { datasets, labels } = this.props.data;
    this.chart.data.datasets = datasets;
    this.chart.data.labels = labels;
    this.chart.update();
  },

  render() {
    return (
      <div className="wgsa-analysis-chart">
        <canvas ref={el => { this.canvas = el; }} />
      </div>
    );
  },

});

function formatChartData(data) {
  const organisms = { label: 'Organism', data: [], backgroundColor: [], labels: [] };
  const stData = { label: 'Sequence Type', data: [], backgroundColor: [], labels: [], parents: [] };

  let organismIndex = 0;
  for (const { label, total, sequenceTypes = [] } of data) {
    organisms.data.push(total);

    const colour = getColour(label);
    organisms.backgroundColor.push(colour);
    organisms.labels.push(label);

    let sum = total;
    for (const st of sequenceTypes) {
      stData.data.push(st.total);
      stData.backgroundColor.push(colour);
      stData.labels.push(st.label);
      stData.parents.push(organismIndex);
      sum -= st.total;
    }
    if (sum > 0) {
      stData.data.push(sum);
      stData.backgroundColor.push('#fefefe');
      stData.labels.push('Unknown ST');
      stData.parents.push(organismIndex);
    }
    organismIndex++;
  }

  return {
    datasets: [
      stData,
      organisms,
    ],
    labels: data.map(({ label }) => label),
  };
}

function mapStateToProps(state) {
  return {
    data: formatChartData(upload.getAnalysisSummary(state)),
  };
}

export default connect(mapStateToProps)(AnalysisChart);
