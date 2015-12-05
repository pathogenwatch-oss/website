import React from 'react';

import DEFAULT from '../../defaults';
import UploadingAssembliesProgress from './UploadingAssembliesProgress.react';

const urlStyle = {
  color: DEFAULT.CGPS.COLOURS.PURPLE_LIGHT,
}

const UploadingFiles = React.createClass({

  propTypes: {
    collectionUrl: React.PropTypes.string,
  },

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  render() {
    return (
      <div className="wgsa-upload-progress">
        <main className="wgsa-upload-progress-container">
          <div className="wgsa-collection-url-display wgsa-card mdl-shadow--2dp">
            <div className="mdl-card__supporting-text">
              Final results will be available at the below URL, <br/>
              if upload fails to progress, please try this URL later.
            </div>
            <div className="mdl-card__supporting-text wgsa-collection-url">
              { this.props.collectionUrl ?
                  <a style={urlStyle} href={this.props.collectionUrl}>{this.props.collectionUrl}</a> :
                  <div className="mdl-spinner mdl-js-spinner is-active"></div>
              }
            </div>
          </div>
          <UploadingAssembliesProgress />
        </main>
      </div>
    );
  },

});

module.exports = UploadingFiles;
