import React from 'react';

import UploadStore from '../../stores/UploadStore.js';
import AssemblyAnalysisOverviewChart from '../../components/collection/AssemblyAnalysisOverviewChart.react';
import OverviewStatisticsItem from './OverviewStatisticsItem.react';
import DEFAULT from '../../defaults';

import Map from '../map/UploadMap.react';

var noContigsRange = {};
var averageAssemblyLength = null;

export default React.createClass({

  propTypes: {
    clickHandler: React.PropTypes.func,
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
      const locationsToAssembliesMap = UploadStore.getLocationToAssembliesMap();
      var iconStyle = {
        color: this.props.isUploading ? DEFAULT.CGPS.COLOURS.PURPLE : (this.props.isReadyToUpload ? 'green' : '#d11b1b')
      };

      return (
        <div className="mdl-grid overviewContent">
          <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
            <div className="heading"> Summary </div>
            <div className="card-style">
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
                  <div className="wgsa-overview-upload-ready-card mdl-card mdl-shadow--2dp">
                    { this.props.isUploading &&
                        <div style={iconStyle} className="mdl-card__title mdl-card--expand">
                          {this.props.uploadProgressPercentage + '%'}
                        </div>
                      ||
                        <div className="mdl-card__title mdl-card--expand">
                          <i style={iconStyle} className="material-icons">{this.props.isReadyToUpload && "check_circle" || "error"}</i>
                        </div>
                    }
                    <span className="mdl-card__actions mdl-card--border">
                      { this.props.isUploading && "Upload In Progress..."
                        ||
                          ( this.props.isReadyToUpload &&  "Ready To Upload" || "Not Ready To Upload")
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">

            <div className="wgsa-chart-select mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
              <div className="mdl-tabs__tab-bar">
                <a href="#overview-chart-panel" className="mdl-tabs__tab  is-active" onClick={this.showChart.bind(this, 'totalNumberOfNucleotidesInDnaStrings', 'Assembly Length')}>Assembly Length</a>
                <a href="#overview-chart-panel" className="mdl-tabs__tab" onClick={this.showChart.bind(this, 'contigN50', 'N50')}>N50</a>
                <a href="#overview-chart-panel" className="mdl-tabs__tab" onClick={this.showChart.bind(this, 'totalNumberOfContigs', 'No. Contigs')}>No. Contigs</a>
              </div>

              <div className="card-style mdl-tabs__panel is-active" id="overview-chart-panel">
                <AssemblyAnalysisOverviewChart chartTitle={this.state.currentChart.title} chartType={this.state.currentChart.type}/>
              </div>
            </div>
          </div>

          <div key="map" className="mdl-cell mdl-cell--12-col increase-cell-gutter mdl-shadow--4dp" style={{ height: '50%' }}>
            <div className="card-style--no-padding" style={{ height: '100%', position: 'relative' }}>
              <Map width="100%" height="100%" locationAssemblyMap={locationsToAssembliesMap}/>
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
            Assembled data must be in multi-FASTA format and should be one file per genome.
          </p>
        </div>
        <div className="welcome-card welcome-card--reverse mdl-shadow--2dp">
          <h2 className="welcome-card__title">CSV File: Metadata</h2>
          <p className="mdl-card__supporting-text">
            To include metadata, drag and drop a CSV file onto the page or click anywhere to open the file upload dialog.
          </p>
          <p className="mdl-card__supporting-text">
            Your CSV file MUST contain a column <span className="wgsa-highlight-text">filename</span> with values matching the name of each assembly file.  We strongly recommend you also include the following columns:
            <br />
             <ul className="wgsa-highlight-text">
               <li>day</li>
               <li>month</li>
               <li>year</li>
               <li>latitude</li>
               <li>longitude</li>
            </ul>
          </p>
          <p className="mdl-card__supporting-text">
            You can add any other columns containing metadata you wish to explore within your genome data set.
          </p>
        </div>
      </div>
    );
  },

});
