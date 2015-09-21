import React from 'react';

import UploadStore from '../../stores/UploadStore.js';
import AssemblyAnalysisOverviewChart from '../../components/collection/AssemblyAnalysisOverviewChart.react';
import AssemblyAnalysisItem from './AssemblyAnalysisItem.react';

import Map from './Map.react';

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

      return (
        <div className="mdl-grid overviewContent">
          <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
            <div className="heading"> Summary </div>
            <div className="card-style">
              <div className="mdl-grid mdl-grid--no-spacing">
                <div className="mdl-cell mdl-cell--6-col">
                  <AssemblyAnalysisItem label="Total Assemblies" value={this.state.assemblyCount} />
                </div>

                <div className="mdl-cell mdl-cell--6-col">
                  <AssemblyAnalysisItem label="No. Contigs Range" value={noContigsRange.min + ' - ' + noContigsRange.max} />
                </div>

                <div className="mdl-cell mdl-cell--6-col">
                  <AssemblyAnalysisItem label="Average Assembly Length" value={averageAssemblyLength} />
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
