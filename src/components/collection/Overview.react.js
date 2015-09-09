import React from 'react';

import UploadStore from '../../stores/UploadStore.js';
import AssemblyAnalysisOverviewChart from '../../components/collection/AssemblyAnalysisOverviewChart.react';
import AssemblyAnalysisItem from './AssemblyAnalysisItem.react';

import Map from './Map.react';

export default React.createClass({

  getInitialState() {
    return {
      assemblies: UploadStore.getAssemblies(),
      assemblyCount: UploadStore.getAssembliesCount(),
      currentChart: {
        title: 'N50 Contigs',
        type: 'contigN50'
      },
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

  componentDidUpdate() {
    if (this.refs.tabs) {
      // componentHandler.upgradeElement(React.findDOMNode(this.refs.tabs));
    }
  },


  showChart() {
    this.setState({
      currentChart: {
        type: event.target.id,
        text: event.target.id
      }
    });
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

            <div ref="tabs" className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
              <div className="mdl-tabs__tab-bar">
                  <a id="contigN50" className="mdl-tabs__tab is-active" onClick={this.showChart}>N50 Contigs</a>
                  <a id="totalNumberOfContigs" className="mdl-tabs__tab" onClick={this.showChart}>Total Contigs</a>
                  <a id="totalNumberOfNucleotidesInDnaStrings" className="mdl-tabs__tab" onClick={this.showChart}>Total Nucleotides</a>
              </div>

              <div className="mdl-tabs__panel is-active" id="overview-chart-panel">
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
