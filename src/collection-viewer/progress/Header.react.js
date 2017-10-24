import React from 'react';
import { connect } from 'react-redux';

import { getProgressPercentage } from './selectors.js';

const subtitleStyle = {
  marginRight: '100px',
  textTransform: 'uppercase',
  color: '#666',
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  fontSize: '16px',
  fontWeight: '500',
};

const uploadButtonStyle = {
  right: '32px',
  top: '32px',
  position: 'absolute',
  zIndex: 1,
  color: '#fff',
  fontSize: '18px',
  fontWeight: '400',
  lineHeight: '56px',
};

const Header = createClass({

  displayName: 'UploadProgressHeader',

  propTypes: {
    percentage: PropTypes.number,
  },

  componentDidMount() {
    const { progressBar } = this.refs;

    progressBar.addEventListener('mdl-componentupgraded', (event) => {
      this.progressBar = event.target.MaterialProgress;
      this.progressBar.setProgress(this.props.percentage);
    });

    componentHandler.upgradeElement(progressBar);
  },

  componentDidUpdate() {
    this.progressBar.setProgress(this.props.percentage);
  },

  render() {
    return (
      <div className="mdl-layout-spacer" style={{ textAlign: 'right' }}>
        <span style={subtitleStyle} className="mdl-layout-title">In Progress</span>
        <div style={uploadButtonStyle} className="wgsa-sonar-effect wgsa-upload-review-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--6dp">
          {this.props.percentage || 0}%
        </div>
        <div className="wgsa-collection-progressbar-container">
          <div ref="progressBar" className="wgsa-collection-progressbar mdl-progress mdl-js-progress"></div>
        </div>
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    percentage: getProgressPercentage(state),
  };
}

export default connect(mapStateToProps)(Header);
