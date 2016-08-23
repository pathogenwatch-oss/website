import React from 'react';
import { connect } from 'react-redux';

import File from './File.react';

import { createCollection } from './actions';

export default connect()(React.createClass({

  propTypes: {
    files: React.PropTypes.array.isRequired,
  },

  createCollection() {
    const { dispatch, files } = this.props;
    dispatch(createCollection(files, files[0].speciesId));
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
        <div className="wgsa-specieator-content text-center">
          <button onClick={this.createCollection} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
            Create Collection
          </button>
        </div>
      </div>
    );
  },

}));
