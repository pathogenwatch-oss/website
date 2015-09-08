import React from 'react';

import UploadStore from '../../stores/UploadStore.js';
import AssemblyAnalysisOverviewChart from '../../components/collection/AssemblyAnalysisOverviewChart.react';
import AssemblyAnalysisItem from './AssemblyAnalysisItem.react';

import Map from './Map.react';

var chartTypes = [
  {
    type: 'contigN50',
    title: 'N50 Contigs'
  },
  {
    type: 'totalNumberOfContigs',
    title: 'Total Contigs'
  },
  {
    type: 'totalNumberOfNucleotidesInDnaStrings',
    title: 'Total Nucleotides'
  }
];

export default React.createClass({

  getInitialState() {
    return {
      assemblies: UploadStore.getAssemblies(),
      assemblyCount: UploadStore.getAssembliesCount(),
      currentChart: chartTypes[0],
      prevButtonDisabled: false,
      nextButtonDisabled: false
    };
  },

  componentDidMount() {
    UploadStore.addChangeListener(this.handleUploadStoreChange);
  },

  componentWillUnmount() {
    UploadStore.removeChangeListener(this.handleUploadStoreChange);
  },

  handleUploadStoreChange() {
    this.setState({
      assemblies: UploadStore.getAssemblies(),
      assemblyCount: UploadStore.getAssembliesCount(),
    });
  },

  showNextChart() {
    var indexOfNextChartType = chartTypes.indexOf(this.state.currentChart) + 1;
    if (indexOfNextChartType < chartTypes.length) {
      this.setState({
        currentChart: chartTypes[indexOfNextChartType],
      });
    }
  },

  showPreviousChart() {
    var indexOfNextChartType = chartTypes.indexOf(this.state.currentChart) - 1;
    if (indexOfNextChartType >= 0) {
      this.setState({
        currentChart: chartTypes[indexOfNextChartType],
      });
    }
  },

  render() {
    if (this.state.assemblyCount) {
      const allLocations = UploadStore.getAllMetadataLocations();
      const locationsToAssembliesMap = UploadStore.getLocationToAssembliesMap();
      var prevButtonDisabled, nextButtonDisabled = false;

      return (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
            <div className="heading"> Overview </div>
            <div className="card-style">
              <AssemblyAnalysisItem label="Total Assemblies" value={this.state.assemblyCount} />
              <AssemblyAnalysisItem label="Mean Contigs" value={200} />
              <AssemblyAnalysisItem label="Total nt" value={2000000} />
            </div>
          </div>

          <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
            <div className="heading">
              {this.state.currentChart.title}
            </div>
            <div className="chart-navigation-div">
              <button type="button" className="mdl-button mdl-js-button"
                disabled={this.state.prevButtonDisabled}
                onClick={this.showPreviousChart}>
                <i className="material-icons">navigate_before</i>
              </button>
              <button type="button" className="mdl-button mdl-js-button"
                disabled={this.state.nextButtonDisabled}
                onClick={this.showNextChart}>
                <i className="material-icons">navigate_next</i>
              </button>
            </div>
            <div className="card-style">
              <AssemblyAnalysisOverviewChart chartTitle={this.state.currentChart.title} chartType={this.state.currentChart.type}/>
            </div>
          </div>

          <div className="mdl-cell mdl-cell--12-col increase-cell-gutter mdl-shadow--4dp">
            <div className="card-style--no-padding">
              <Map width="100%" height="400" locationAssemblyMap={locationsToAssembliesMap}/>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="welcome-container wgsa-workspace-click-area" onClick={this.props.clickHandler}>
        <p className="welcome-intro">
          Drag and drop files or click anywhere to begin.
        </p>
        <div className="welcome-card mdl-shadow--2dp">
          <h2 className="welcome-card__title">Fasta Files</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec efficitur purus eleifend lacus pretium tincidunt. In hac habitasse platea dictumst. Quisque eu tincidunt tortor, id vehicula risus. Aliquam dignissim nisi et sem porttitor vestibulum.
          </p>
        </div>
        <div className="welcome-card welcome-card--reverse mdl-shadow--2dp">
          <h2 className="welcome-card__title">CSV Files</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec efficitur purus eleifend lacus pretium tincidunt. In hac habitasse platea dictumst. Quisque eu tincidunt tortor, id vehicula risus. Aliquam dignissim nisi et sem porttitor vestibulum.
          </p>
        </div>
      </div>
    );
  },

});
