/* global Chart */

import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import 'chart.piecelabel.js';
import { AutoSizer } from 'react-virtualized';

import ChartResizer from '../../components/chart-resizer';

import {
  getChartData,
  getSelectedOrganism,
  isSpecieationComplete,
  isAnalysisComplete,
  hasErrors,
} from './selectors';

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
  return organismsMeta.data[index].selected
    ? organisms.organismIds[index]
    : null;
}

const AnalysisChart = React.createClass({
  componentDidMount() {
    this.chart = new Chart(this.canvas, {
      type: 'doughnut',
      data: this.props.data,
      options: {
        responsive: false,
        maintainAspectRatio: false,
        animation: {
          animateRotate: true,
          animateScale: true,
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title: (points, { datasets }) =>
              points
                .map(
                  ({ index, datasetIndex }) =>
                    datasets[datasetIndex].labels[index]
                )
                .join(', '),
            label: ({ index, datasetIndex }, { datasets }) => {
              const dataset = datasets[datasetIndex];
              return `${dataset.data[index]} / ${dataset.total}, ${(
                (100 * dataset.data[index]) /
                dataset.total
              ).toFixed(1)}%`;
            },
          },
        },
        pieceLabel: {
          render: ({ dataset, index }) =>
            (dataset.shortLabels || dataset.labels)[index],
          precision: 2,
          fontColor: '#fff',
          fontSize: 13,
          fontStyle: '400',
          fontFamily: 'Roboto',
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
            this.toggleOrganism(
              this.chart.data.datasets[0].parents[item._index]
            );
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
      const existing = this.chart.data.datasets.find(
        _ => _.label === dataset.label
      );
      if (existing) {
        existing.data = dataset.data;
        existing.backgroundColor = dataset.backgroundColor;
        existing.organismIds = dataset.organismIds;
        existing.labels = dataset.labels;
        existing.shortLabels = dataset.shortLabels;
        existing.parents = dataset.parents;
        existing.total = dataset.total;
      } else {
        this.chart.data.datasets.unshift(dataset);
      }
    }
    this.chart.update();
  },

  getGenomesLink() {
    const { uploadedAt, selectedOrganism } = this.props;
    let link = `/genomes?uploadedAt=${uploadedAt}`;
    if (selectedOrganism) link += `&organismId=${selectedOrganism}`;
    return link;
  },

  toggleOrganism(index) {
    const id = toggleOrganism(index, this.chart);
    this.props.selectOrganism(id);
  },

  render() {
    return (
      <div className="wgsa-analysis-chart">
        <AutoSizer>
          {({ width, height }) => (
            <ChartResizer height={height} width={width} chart={this.chart}>
              <canvas
                ref={el => {
                  this.canvas = el;
                }}
              />
            </ChartResizer>
          )}
        </AutoSizer>
        {this.props.specieationComplete && (
          <Link
            className={classnames('mdl-shadow--2dp wgsa-view-genomes-button', {
              'wgsa-sonar-effect': this.props.sonar,
            })}
            to={this.getGenomesLink()}
          >
            View Genomes
          </Link>
        )}
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    data: getChartData(state),
    specieationComplete: isSpecieationComplete(state),
    sonar: isAnalysisComplete(state) && !hasErrors(state),
    selectedOrganism: getSelectedOrganism(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectOrganism: id => dispatch(selectOrganism(id)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalysisChart);
