import '../../css/upload-review.css';

import React from 'react';

import AssemblyList from './navigation/AssemblyList.react';

import UploadWorkspaceNavigationStore from '../../stores/UploadWorkspaceNavigationStore';
import UploadStore from '../../stores/UploadStore';

const titleStyle = {
  margin: 0,
};

export default React.createClass({

  componentDidMount() {
    UploadWorkspaceNavigationStore.addChangeListener(this.hideSidebar);
    UploadStore.addChangeListener(this.hideSidebar);
  },

  componentWillUnmount() {
    UploadWorkspaceNavigationStore.removeChangeListener(this.hideSidebar);
    UploadStore.removeChangeListener(this.hideSidebar);
  },

  render() {
    return (
      <aside ref="sidebar" className="navigation-container mdl-layout__drawer mdl-shadow--2dp">
        <h2 className="uploadWorkspaceNavigationTitle">
          <span className="mdl-badge" style={titleStyle} data-badge={this.props.totalAssemblies}>Assemblies</span>
        </h2>
        <div className="wgsa-assembly-list-wrapper">
          <AssemblyList />
        </div>
        { this.props.children && this.props.children }
      </aside>
    );
  },

  hideSidebar() {
    React.findDOMNode(this.refs.sidebar).classList.remove('is-visible');
  },

});
