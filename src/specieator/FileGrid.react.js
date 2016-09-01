import React from 'react';
import { connect } from 'react-redux';

import File from './File.react';

export default connect()(React.createClass({

  propTypes: {
    files: React.PropTypes.array.isRequired,
  },

  render() {
    const { files } = this.props;
    return (
      <div className="wgsa-specieator-files">
        <div className="wgsa-specieator-content">
          <p className="wgsa-specieator-summary">
            Viewing <span>{files.length}</span> of {files.length} assemblies
          </p>
        </div>
        <div className="mdl-grid">
          {files.map(file => <File key={file.name} { ...file } />)}
        </div>
      </div>
    );
  },

}));
