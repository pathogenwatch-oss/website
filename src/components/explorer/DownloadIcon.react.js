import '../../css/spinner.css';

import React from 'react';

import DEFAULT from '^/defaults';

const errorStyle = {
  color: DEFAULT.DANGER_COLOUR,
};

const Spinner = React.createClass({

  componentDidMount() {
    componentHandler.upgradeElement(this.refs.spinner);
  },

  render() {
    return (
      <span ref="spinner" className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></span>
    );
  },

});

export default ({ loading, hasLink, error }) => (
  <div className="wgsa-download-icon" >
    { loading ?
      <Spinner />
      :
      <span className="mdl-button mdl-button--icon">
        <i className="wgsa-button-icon material-icons" style={error ? errorStyle : null}>
          { !hasLink || error ? 'insert_drive_file' : 'file_download' }
        </i>
      </span>
    }
  </div>
);
