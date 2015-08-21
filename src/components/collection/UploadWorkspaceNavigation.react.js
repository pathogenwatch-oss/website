import React from 'react';
import assign from 'object-assign';

import AssemblyList from './navigation/AssemblyList.react';
import PreviousAssemblyButton from './navigation/PreviousAssemblyButton.react';
import NextAssemblyButton from './navigation/NextAssemblyButton.react';
import UploadStore from '../../stores/UploadStore';
import UploadOverview from './UploadOverview.react.js';
import '../../css/UploadReview.css';

const AssemblyOverviewButton = React.createClass({
  handleClick: function () {
    const allAssemblyN50s = UploadStore.getAllAssemblyN50Data();
  },

  render: function () {
    return (
      <button type="button" className="mdl-button mdl-js-button" onClick={this.handleClick}>
        Overview
      </button>
    );
  }
});


const Component = React.createClass({

  componentDidMount: function() {
    const container = this.getDOMNode('uploadWorkspaceNavigationContainer');
    container.style.height = window.innerHeight;
  },

  render: function () {
    return (
      <div className='uploadWorkspaceNavigationContainer'>
        <form className="assemblyNavTitle form-inline">
          <div className="form-group">
            <div className="uploadWorkspaceNavigationTitle mdl-badge" data-badge={this.props.totalAssemblies}>
              <span>Assemblies</span>
            </div>
            <AssemblyOverviewButton />
            <div className="btn-group" role="group" aria-label="...">

            </div>
          </div>
        </form>
        <div className="form-group">
          <AssemblyList />
        </div>
      </div>
    );
  }
});

module.exports = Component;
