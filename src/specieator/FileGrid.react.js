import React from 'react';

import File from './File.react';

export default React.createClass({

  propTypes: {
    files: React.PropTypes.array.isRequired,
  },

  render() {
    return (
      <div className="mdl-grid">
        {this.props.files.map(file => <File key={file.name} { ...file } />)}
      </div>
    );
  },

});
