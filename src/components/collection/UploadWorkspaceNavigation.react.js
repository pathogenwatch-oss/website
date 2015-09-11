import '../../css/upload-review.css';

import React from 'react';

import AssemblyList from './navigation/AssemblyList.react';

import UploadWorkspaceNavigationStore from '../../stores/UploadWorkspaceNavigationStore';

const titleStyle = {
  margin: 0,
};

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
