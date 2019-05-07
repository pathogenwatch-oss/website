/* global Chart */

import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import 'chart.piecelabel.js';
import { AutoSizer } from 'react-virtualized';

import ChartResizer from '~/components/chart-resizer';

import { getChartData, getSelectedOrganism } from './selectors';
import {
  isSpecieationComplete,
  isAnalysisComplete,
  hasErrors,
} from '../selectors';

import { selectOrganism } from './actions';

const AnalysisChart = React.createClass({
  componentDidMount() {
    this.chart = new Chart(this.canvas, {
      type: 'doughnut',
      data: {
        datasets: this.props.datasets.reverse(),
      },
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
              if (dataset.tooltips) {
                return dataset.tooltips[index];
              }
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
      },
    });
    window.pw = { chart: this.chart };
  },

  componentDidUpdate() {
    for (const dataset of this.props.datasets) {
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
        existing.tooltips = dataset.tooltips;
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
          <React.Fragment>
            <div className="pw-analysis-chart-hover-trigger" />
            <Link
              className={classnames(
                'mdl-shadow--2dp wgsa-view-genomes-button',
                {
                  'wgsa-sonar-effect': this.props.sonar,
                }
              )}
              to={this.getGenomesLink()}
            >
              View Genomes
            </Link>
          </React.Fragment>
        )}
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    datasets: getChartData(state),
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
