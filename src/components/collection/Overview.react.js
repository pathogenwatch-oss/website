import React from 'react';

import UploadStore from '../../stores/UploadStore.js';
import AssemblyAnalysisOverviewChart from '../../components/collection/AssemblyAnalysisOverviewChart.react';
import OverviewStatisticsItem from './OverviewStatisticsItem.react';
import Map from '../map/UploadOverviewMap.react';

import { FASTA_FILE_EXTENSIONS } from '../../utils/File';
import DEFAULT from '../../defaults';

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
    };
  },

  componentDidMount() {
    UploadStore.addChangeListener(this.handleUploadStoreChange);
    componentHandler.upgradeDom();
  },

  componentDidUpdate() {
    var range = UploadStore.getMinMaxNoContigsForAllAssemblies();
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
      const iconStyle = {
        color: this.props.isReadyToUpload ? DEFAULT.CGPS.COLOURS.GREEN : DEFAULT.DANGER_COLOUR,
      };

      return (
        <div className="mdl-grid overviewContent">
          <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
            <div className="wgsa-card-heading">Summary</div>
            <div className="wgsa-card-content">
              <div className="mdl-grid mdl-grid--no-spacing">
                <div className="mdl-cell mdl-cell--6-col">
                  <OverviewStatisticsItem label="Total Assemblies" value={this.state.assemblyCount} />
                </div>
                <div className="mdl-cell mdl-cell--6-col">
                  <OverviewStatisticsItem label="No. Contigs Range" value={noContigsRange.min + ' - ' + noContigsRange.max} />
                </div>
                <div className="mdl-cell mdl-cell--6-col">
                  <OverviewStatisticsItem label="Average Assembly Length" value={averageAssemblyLength} />
                </div>
                <div className="mdl-cell mdl-cell--6-col">
                  <div className="wgsa-overview-upload-ready-card mdl-card">
                    { this.props.isUploading &&
                        <div style={iconStyle} className="mdl-card__title mdl-card--expand">
                          {this.props.uploadProgressPercentage + '%'}
                        </div>
                      ||
                        <div className="mdl-card__title mdl-card--expand">
                          <i style={iconStyle} className="material-icons">{this.props.isReadyToUpload && 'check_circle' || 'error'}</i>
                        </div>
                    }
                    <span className="mdl-card__actions mdl-card--border">
                      { this.props.isUploading ? 'Upload In Progress...'
                        :
                          ( this.props.isReadyToUpload &&  'Ready To Upload' || 'Not Ready To Upload')
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp chart-card">

            <div className="wgsa-chart-select mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
              <div className="mdl-tabs__tab-bar">
                <a href="#overview-chart-panel" className="mdl-tabs__tab  is-active" onClick={this.showChart.bind(this, 'totalNumberOfNucleotidesInDnaStrings', 'Assembly Length')}>Assembly Length</a>
                <a href="#overview-chart-panel" className="mdl-tabs__tab" onClick={this.showChart.bind(this, 'contigN50', 'N50')}>N50</a>
                <a href="#overview-chart-panel" className="mdl-tabs__tab" onClick={this.showChart.bind(this, 'totalNumberOfContigs', 'No. Contigs')}>No. Contigs</a>
                <a href="#overview-chart-panel" className="mdl-tabs__tab" onClick={this.showChart.bind(this, 'totalNumberOfNsInDnaStrings', 'N Count')}>N Count</a>
              </div>

              <div className="wgsa-card-content mdl-tabs__panel is-active" id="overview-chart-panel">
                <AssemblyAnalysisOverviewChart chartTitle={this.state.currentChart.title} chartType={this.state.currentChart.type}/>
              </div>
            </div>
          </div>

          <div key="map" className="mdl-cell mdl-cell--12-col increase-cell-gutter mdl-shadow--4dp" style={{ height: '50%' }}>
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
