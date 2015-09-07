import '../../css/upload-review.css';

import React from 'react';

import AssemblyList from './navigation/AssemblyList.react';
import UploadWorkspaceNavigationActionCreators from '../../actions/UploadWorkspaceNavigationActionCreators.js';
import DEFAULT from '../../defaults';

const titleStyle = {
  margin: 0,
};

const overflowWrapperStyle = {
  position: 'relative',
};

const AssemblyOverviewButton = React.createClass({

  handleClick: function () {
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(null);
  },

  render: function () {
    return (
      <button type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onClick={this.handleClick}>
        Overview
      </button>
    );
  },

});

export default React.createClass({

  render: function () {
    return (
      <aside className="navigation-container mdl-layout__drawer">
        <div className="uploadWorkspaceNavigationTitle">
          <span className="mdl-badge" style={titleStyle} data-badge={this.props.totalAssemblies}>Assemblies</span>
        </div>
        <AssemblyOverviewButton enabled={this.props.assembliesUploaded}/>
        <div className="wgsa-assembly-list-wrapper">
          <AssemblyList />
        </div>
        { this.props.children && this.props.children }
      </aside>
    );
  },

});
