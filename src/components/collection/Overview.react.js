import React from 'react';

import UploadStore from '../../stores/UploadStore.js';
import AssemblyAnalysisOverviewChart from '../../components/collection/AssemblyAnalysisOverviewChart.react';
import AssemblyAnalysisItem from './AssemblyAnalysisItem.react';

import Map from './Map.react';
import DEFAULT from '../../defaults';

const welcomeText = {
  color: DEFAULT.CGPS.COLOURS.GREEN_MID,
};

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
              <Map width='100%' height='400' locations={allLocations}/>
            </div>
          </div>

        </div>

      );
    }

    return (
      <div className="welcome-container">
        <div className="welcome-card-wide mdl-shadow--2dp">
          <div className="welcome-card-content">
            <h2 className="welcome-card-title">Fasta Files</h2>
            <p style={welcomeText} className="">Drop your assemblies here for quick analysis and easy upload.</p>
          </div>
        </div>
      </div>
    );
  },

});
