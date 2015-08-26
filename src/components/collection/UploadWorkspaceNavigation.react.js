import '../../css/UploadReview.css';

import React from 'react';
import assign from 'object-assign';

import AssemblyList from './navigation/AssemblyList.react';
import PreviousAssemblyButton from './navigation/PreviousAssemblyButton.react';
import NextAssemblyButton from './navigation/NextAssemblyButton.react';
import UploadWorkspaceNavigationActionCreators from '../../actions/UploadWorkspaceNavigationActionCreators.js';
import DEFAULT from '../../defaults';

var buttonStyle = {
  'backgroundColor': DEFAULT.CGPS.COLOURS.GREY
}

const AssemblyOverviewButton = React.createClass({
  handleClick: function () {
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(null);
  },

  render: function () {

    if (this.props.enabled) {
      buttonStyle.backgroundColor = '#fff';
    }
    else {
      buttonStyle.backgroundColor = DEFAULT.CGPS.COLOURS.GREY;
    }

    return (
      <button type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onClick={this.handleClick}>
        Overview
      </button>
    );
  }
});

const Component = React.createClass({

  render: function () {
    return (
      <aside className='mdl-layout__drawer'>
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
