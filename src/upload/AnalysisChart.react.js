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

function toggleOrganism(index, chart) {
  const [ sts ] = chart.config.data.datasets;
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
}

const AnalysisChart = React.createClass({

  componentDidMount() {
    this.chart = new Chart(this.canvas, {
      type: 'doughnut',
      data: this.props.data,
      options: {
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
          onClick: (e, item) => toggleOrganism(item.index, this.chart),
        },
        onClick: (e, [ item ]) => {
          if (item._datasetIndex === 0) {
            toggleOrganism(this.chart.data.datasets[0].parents[item._index], this.chart);
          } else {
            toggleOrganism(item._index, this.chart);
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
  };
}

function mapStateToProps(state) {
  return {
    data: formatChartData(upload.getAnalysisSummary(state)),
  };
}

export default connect(mapStateToProps)(AnalysisChart);
