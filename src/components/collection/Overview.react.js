import React from 'react';

import UploadStore from '../../stores/UploadStore.js';
import AssemblyMetadata from './AssemblyMetadata.react';
import AssemblyAnalysisOverviewChart from '../../components/collection/AssemblyAnalysisOverviewChart.react';
import AssemblyAnalysisItem from './AssemblyAnalysisItem.react';

import Map from './Map.react';
import DEFAULT from '../../defaults';

const welcomeText = {
  color: DEFAULT.CGPS.COLOURS.GREEN_MID
};

export default React.createClass({

  getInitialState() {
    return {
      assemblies: UploadStore.getAssemblies(),
      assemblyCount: UploadStore.getAssembliesCount()
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
      assemblyCount: UploadStore.getAssembliesCount()
    });
  },

  render() {
    if (this.state.assemblyCount) {
      const allLocations = UploadStore.getAllMetadataLocations();
      const locationsToAssembliesMap = UploadStore.getLocationToAssembliesMap();

      return (
        <div className='mdl-grid'>

          <div className='mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp'>
            <div className='card-style'>
              <div className='heading'> Statistics </div>
              <AssemblyAnalysisItem label="Total Assemblies" value={this.state.assemblyCount} />
              <AssemblyAnalysisItem label="Mean Contigs" value={200} />
              <AssemblyAnalysisItem label="Total nt" value={2000000} />
            </div>
          </div>

          <div className='mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp'>
            <div className='card-style'>
              <div className='heading'> Overview N50 contigs Chart </div>
              <AssemblyAnalysisOverviewChart />
            </div>
          </div>

          <div className='mdl-cell mdl-cell--12-col increase-cell-gutter mdl-shadow--4dp'>
            <div className='card-style--no-padding'>
              <Map width='100%' height='400' locations={allLocations} locationAssemblyMap={locationsToAssembliesMap}/>
            </div>
          </div>

        </div>

      );
    }

    return (
      <div className="welcomeContainer">
        <div className="welcome-card-wide mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title">
            <h2 style={welcomeText} className="mdl-card__title-text">Drop your assemblies here for quick analysis and easy upload.</h2>
          </div>
          <div className="mdl-card__supporting-text">
          </div>
        </div>
        <h4></h4>
      </div>
    )
  }

});
