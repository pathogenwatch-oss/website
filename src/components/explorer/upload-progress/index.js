import '^/css/upload-progress.css';

import React from 'react';

import Header from './Header.react';
import Dashboard from './Dashboard.react';

import { CGPS } from '^/defaults';

const layoutContentStyle = {
  background: CGPS.COLOURS.GREY_LIGHT,
  position: 'relative',
};

const UploadProgress = React.createClass({

  propTypes: {
    checkStatus: React.PropTypes.func,
    progress: React.PropTypes.object,
  },

  componentDidMount() {
    this.statusInterval = setInterval(this.props.checkStatus, 1000);
  },

  componentWillUnmount() {
    clearInterval(this.statusInterval);
  },

  render() {
    const { receivedResults, expectedResults, ...dashboardProps } = this.props.progress;
    const percentage = Math.floor(receivedResults / expectedResults * 100);
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <Header percentage={percentage} />
        <main className="mdl-layout__content" style={layoutContentStyle}>
          <div className="wgsa-upload-progress">
            <main className="wgsa-upload-progress-container">
              <div className="wgsa-collection-url-display wgsa-card mdl-shadow--2dp">
                <div className="mdl-card__supporting-text">
                  Final results will be available at this address. <br/>
                  If upload fails to progress, please refresh at a later time.
                </div>
              </div>
              <Dashboard {...dashboardProps} />
            </main>
          </div>
        </main>
      </div>
    );
  },

});

export default UploadProgress;
