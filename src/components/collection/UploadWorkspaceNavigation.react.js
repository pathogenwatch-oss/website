import '../../css/upload-review.css';

import React from 'react';

import AssemblyList from './navigation/AssemblyList.react';

import UploadWorkspaceNavigationActionCreators from '../../actions/UploadWorkspaceNavigationActionCreators';
import UploadWorkspaceNavigationStore from '../../stores/UploadWorkspaceNavigationStore';

const titleStyle = {
  margin: 0,
};

const AssemblyOverviewButton = React.createClass({

  render() {
    return (
      <button type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onClick={this.handleClick}>
        Overview
      </button>
    );
  },

  handleClick() {
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(null);
  },

});

export default React.createClass({

  componentDidMount() {
    UploadWorkspaceNavigationStore.addChangeListener(this.handleNavigationChange);
  },

  componentWillUnmount() {
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleNavigationChange);
  },

  render() {
    return (
      <aside ref="sidebar" className="navigation-container mdl-layout__drawer">
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

  handleNavigationChange() {
    React.findDOMNode(this.refs.sidebar).classList.remove('is-visible');
  },

});
