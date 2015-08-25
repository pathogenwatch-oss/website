import React from 'react';

import UploadStore from '../../stores/UploadStore.js';

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
      return ( <h1>Overview</h1> );
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
