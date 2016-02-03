import React from 'react';

import FileUploadingProgress from '../../upload/FileUploadingProgress.react';
import UploadButton from '../../upload/navigation/UploadButton.react';

import FileUploadingProgressStore from '^/stores/FileUploadingProgressStore';

import Species from '^/species';
import DEFAULT from '^/defaults';

const headerStyle = {
  'background': '#fff',
  'color': DEFAULT.CGPS.COLOURS.PURPLE,
};

const subtitleStyle = {
  marginRight: '100px',
  textTransform: 'uppercase',
  color: '#666',
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  fontSize: '16px',
  fontWeight: '500',
};

const uploadButtonStyle = {
  right: '30px',
  top: '24px',
  position: 'absolute',
  zIndex: 1,
  color: '#fff',
  fontSize: '18px',
  fontWeight: '400',
  lineHeight: '56px',
};

export default React.createClass({

  displayName: 'UploadProgressHeader',

  propTypes: {
    percentage: React.PropTypes.number,
  },

  render() {
    return (
        <header style={headerStyle} className="mdl-layout__header">
          <div className="mdl-layout-icon"></div>
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">WGSA | {Species.formattedName}</span>
            <span className="mdl-layout-spacer" />
            <span style={subtitleStyle} className="mdl-layout-title">Upload Progress</span>
            <div style={uploadButtonStyle} className="wgsa-sonar-effect wgsa-upload-review-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--6dp">
              {this.props.percentage || 0}%
            </div>
          </div>
          <FileUploadingProgress />
        </header>
    );
  },

});
