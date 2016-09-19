import React from 'react';
import { connect } from 'react-redux';

import GridItem from './GridItem.react';

export default connect()(React.createClass({

  propTypes: {
    files: React.PropTypes.array.isRequired,
  },

  render() {
    const { files, total } = this.props;
    return (
      <div className="wgsa-hub-files">
        <div className="wgsa-hub-content">
          <p className="wgsa-hub-summary">
            Viewing <span>{files.length}</span> of {total} assemblies
          </p>
        </div>
        <div className="mdl-grid">
          {files.map(file => <GridItem key={file.name} { ...file } />)}
        </div>
      </div>
    );
  },

}));
