import '../../css/spinner.css';

import React from 'react';

import DEFAULT from '^/defaults';

const errorStyle = {
  color: DEFAULT.DANGER_COLOUR,
};

export default React.createClass({

  displayName: 'DownloadIcon',

  propTypes: {
    loading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    hasLink: React.PropTypes.bool,
  },

  componentDidUpdate() {
    if (this.props.loading) {
      componentHandler.upgradeElement(this.refs.spinner);
    }
  },

  render() {
    const { loading, hasLink, error } = this.props;
    return (
      <div className="wgsa-download-icon" >
        { loading ?
          <div ref="spinner" className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
          :
          <span className="mdl-button mdl-button--icon" style={error ? errorStyle : null}>
            <i className="wgsa-button-icon material-icons">
              { !hasLink || error ? 'insert_drive_file' : 'file_download' }
            </i>
          </span>
        }
      </div>
    );
  },

});
