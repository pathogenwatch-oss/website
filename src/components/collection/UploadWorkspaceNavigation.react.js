import '../../css/UploadReview.css';

import React from 'react';
import assign from 'object-assign';

import AssemblyList from './navigation/AssemblyList.react';
import PreviousAssemblyButton from './navigation/PreviousAssemblyButton.react';
import NextAssemblyButton from './navigation/NextAssemblyButton.react';
import UploadOverview from './UploadOverview.react.js';

import UploadWorkspaceNavigationActionCreators from '../../actions/UploadWorkspaceNavigationActionCreators.js';

const AssemblyOverviewButton = React.createClass({
  handleClick: function () {
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(null);
  },

  render: function () {
    return (
      <button type="button" disabled={!this.props.enabled} className="mdl-button mdl-js-button" onClick={this.handleClick}>
        Overview
      </button>
    );
  }
});

const Component = React.createClass({

  render: function () {
    return (
      <aside className='mdl-layout__drawer mdl-shadow--4dp'>
        <div className="uploadWorkspaceNavigationTitle">
          <span className="mdl-badge" data-badge={this.props.totalAssemblies}>Assemblies</span>
        </div>
        <AssemblyOverviewButton enabled={this.props.assembliesUploaded}/>
        <AssemblyList />
      </aside>
    );
  }
});

module.exports = Component;
