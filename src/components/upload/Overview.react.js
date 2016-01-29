import React from 'react';

import AssemblyAnalysisOverviewChart from './AssemblyAnalysisOverviewChart.react';
import OverviewStatisticsItem from './OverviewStatisticsItem.react';
import OverviewStatusItem from './OverviewStatusItem.react';
import Map from './UploadOverviewMap.react';

import UploadStore from '^/stores/UploadStore.js';

import { FASTA_FILE_EXTENSIONS } from '^/utils/File';

const noContigsRange = {};
let averageAssemblyLength = null;

export default React.createClass({

  displayName: 'Overview',

  propTypes: {
    clickHandler: React.PropTypes.func,
    isReadyToUpload: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      assemblies: UploadStore.getAssemblies(),
      assemblyCount: UploadStore.getAssembliesCount(),
      currentChart: {
        title: 'Assembly Length',
        type: 'totalNumberOfNucleotidesInDnaStrings',
      },
      uploadProgressPercentage: 0,
    };
  },

  componentDidMount() {
    UploadStore.addChangeListener(this.handleUploadStoreChange);
    componentHandler.upgradeDom();
  },

  componentDidUpdate() {
    const range = UploadStore.getMinMaxNoContigsForAllAssemblies();
    noContigsRange.min = range[0];
    noContigsRange.max = range[1];
    averageAssemblyLength = UploadStore.getAverageAssemblyLengthForAllAssemblies();
    componentHandler.upgradeDom();
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

  showChart(type = 'NO DATA FOUND', title = '') {
    this.setState({
      currentChart: {
        type: type,
        title: title,
      },
    });
  },

  render() {
    if (this.state.assemblyCount) {
      return (
        <div className="mdl-grid overviewContent">
          <div className="wgsa-card mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--2dp">
            <div className="wgsa-card-heading">Summary</div>
            <div className="wgsa-card-content wgsa-summary-stats mdl-grid">
              <OverviewStatisticsItem label="Total Assemblies" value={this.state.assemblyCount} />
              <OverviewStatisticsItem label="No. Contigs Range" value={noContigsRange.min + ' - ' + noContigsRange.max} />
              <OverviewStatisticsItem label="Average Assembly Length" value={averageAssemblyLength} />
              <OverviewStatusItem isReadyToUpload={this.props.isReadyToUpload} isUploading={this.props.isUploading} />
            </div>
          </div>

          <div className="wgsa-card mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--2dp chart-card">

            <div className="wgsa-chart-select mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
              <div className="mdl-tabs__tab-bar">
                <a href="#overview-chart-panel" className="mdl-tabs__tab  is-active" onClick={this.showChart.bind(this, 'totalNumberOfNucleotidesInDnaStrings', 'Assembly Length')}>Assembly Length</a>
                <a href="#overview-chart-panel" className="mdl-tabs__tab" onClick={this.showChart.bind(this, 'contigN50', 'N50')}>N50</a>
                <a href="#overview-chart-panel" className="mdl-tabs__tab" onClick={this.showChart.bind(this, 'totalNumberOfContigs', 'No. Contigs')}>No. Contigs</a>
                <a href="#overview-chart-panel" className="mdl-tabs__tab" onClick={this.showChart.bind(this, 'totalNumberOfNsInDnaStrings', 'Non-ATCG')}>Non-ATCG</a>
              </div>

              <div className="wgsa-card-content mdl-tabs__panel is-active" id="overview-chart-panel">
                <AssemblyAnalysisOverviewChart chartTitle={this.state.currentChart.title} chartType={this.state.currentChart.type}/>
              </div>
            </div>
          </div>

          <div key="map" className="mdl-cell mdl-cell--12-col increase-cell-gutter mdl-shadow--2dp" style={{ height: '50%' }}>
            <div style={{ height: '100%', position: 'relative' }}>
              <Map assemblies={this.state.assemblies}/>
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
          <h2 className="welcome-card__title">FASTA Files: Genome Assemblies</h2>
          <p className="mdl-card__supporting-text">
            Drag and drop assemblies onto the page or click anywhere to open the file upload dialog.
          </p>
          <p className="mdl-card__supporting-text">
            Assembled data must be in multi-FASTA format, should be one file per genome and have one of the following extensions:
          </p>
          <p className="wgsa-highlight-text">{FASTA_FILE_EXTENSIONS.join(', ')}</p>
        </div>
        <div className="welcome-card welcome-card--reverse mdl-shadow--2dp">
          <h2 className="welcome-card__title">CSV File: Metadata</h2>
          <p className="mdl-card__supporting-text">
            To include metadata, drag and drop a CSV file onto the page or click anywhere to open the file upload dialog.
          </p>
          <p className="mdl-card__supporting-text">
            Your CSV file MUST contain a column <span className="wgsa-highlight-text">filename</span> with values matching the name of each assembly file.  We strongly recommend you also include the following columns:
          </p>
          <p className="wgsa-highlight-text">day, month, year, latitude, longitude</p>
          <p className="mdl-card__supporting-text">
            You can add any other columns containing metadata you wish to explore within your genome data set.
          </p>
        </div>
      </div>
    );
  },

});
