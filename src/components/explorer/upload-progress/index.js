import '^/css/upload-progress.css';

import React from 'react';

import Header from './Header.react';
import Dashboard from './Dashboard.react';

import { CGPS } from '^/defaults';

const layoutContentStyle = {
  background: CGPS.COLOURS.GREY_LIGHT,
  position: 'relative',
};

// const connectDashboard = connect(
//
// );

const UploadProgress = React.createClass({

  componentDidMount() {
    // componentHandler.upgradeElement(this.refs.spinner);
  },

  render() {
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <Header />
        <main className="mdl-layout__content" style={layoutContentStyle}>
          <div className="wgsa-upload-progress">
            <main className="wgsa-upload-progress-container">
              <div className="wgsa-collection-url-display wgsa-card mdl-shadow--2dp">
                <div className="mdl-card__supporting-text">
                  Final results will be available at this address. <br/>
                  If upload fails to progress, please refresh at a later time.
                </div>
              </div>
              {/*{connectDashboard(Dashboard)}*/}
              <Dashboard />
            </main>
          </div>
        </main>
      </div>
    );
  },

});

module.exports = UploadProgress;
