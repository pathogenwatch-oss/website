import React from 'react';

import UploadStore from '../../stores/UploadStore.js';
import AssemblyMetadata from './AssemblyMetadata.react';
import AssemblyWorkspaceHeader from '../../components/collection/AssemblyWorkspaceHeader.react';
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

  render() {

    if (this.state.assemblyCount) {
      const allLocations = UploadStore.getAllMetadataLocations();
      return (

        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <div className="overview-card-wide mdl-card mdl-shadow--2dp">
              <div className="mdl-card--title mdl-card--expand">
                <div className='mdl-grid'>
                  <div className='mdl-cell mdl-cell--5-col'>
                    <AssemblyWorkspaceHeader text='Statistics' />
                    <AssemblyAnalysisItem label="Total Assemblies" value={this.state.assemblyCount} />

                  </div>
                  <div className='mdl-cell mdl-cell--7-col'>
                    <AssemblyWorkspaceHeader text='Overview Chart' />
                    <AssemblyAnalysisOverviewChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <div className="overview-card-wide mdl-card mdl-shadow--2dp">
              <Map width='100%' height='400' locations={allLocations}/>
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
  },

  handleUploadStoreChange() {
    this.setState({
      assemblies: UploadStore.getAssemblies(),
      assemblyCount: UploadStore.getAssembliesCount()
    });
  }

});
