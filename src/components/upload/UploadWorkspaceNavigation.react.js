import '../../css/upload-review.css';

import React from 'react';

import AssemblyList from './navigation/AssemblyList.react';

const titleStyle = {
  margin: 0,
};

export default React.createClass({

  render() {
    return (
      <aside className="navigation-container mdl-layout__drawer mdl-shadow--3dp">
        <h2 className="uploadWorkspaceNavigationTitle">
          <span className="mdl-badge" style={titleStyle} data-badge={this.props.totalAssemblies}>Assemblies</span>
        </h2>
        <AssemblyList />
        { this.props.children && this.props.children }
      </aside>
    );
  },

});
