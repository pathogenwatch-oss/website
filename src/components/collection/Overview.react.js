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

  render() {
    if (this.state.assemblyCount) {
      const allLocations = UploadStore.getAllMetadataLocations();
      const locationsToAssembliesMap = UploadStore.getLocationToAssembliesMap();

      return (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
            <div className="card-style">
              <div className="heading"> Overview </div>
              <AssemblyAnalysisItem label="Total Assemblies" value={this.state.assemblyCount} />
              <AssemblyAnalysisItem label="Mean Contigs" value={200} />
              <AssemblyAnalysisItem label="Total nt" value={2000000} />
            </div>
          </div>

          <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
            <div className="card-style">
              <div className="heading"> N50 contigs Chart </div>
              <AssemblyAnalysisOverviewChart />
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
