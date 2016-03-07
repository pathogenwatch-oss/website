import '^/css/upload-progress.css';

import React from 'react';
import { connect } from 'react-redux';

import Header from './Header.react';
import Dashboard from './Dashboard.react';

import UploadActionCreators from '^/actions/UploadActionCreators';

import FileUploadingStore from '^/stores/FileUploadingStore';
import { subscribe } from '^/utils/Notification';

import { updateHeader } from '^/actions/header';

import Species from '^/species';

const UploadProgress = React.createClass({

  propTypes: {
    checkStatus: React.PropTypes.func,
    updateProgress: React.PropTypes.func,
    progress: React.PropTypes.object,
    isUploading: React.PropTypes.bool,
    dispatch: React.PropTypes.func,
  },

  componentWillMount() {
    this.props.dispatch(updateHeader({
      speciesName: Species.formattedName,
      classNames: 'mdl-shadow--3dp',
      content: (<Header />),
    }));

    document.title = 'WGSA | Upload Progress';
  },

  componentDidMount() {
    componentHandler.upgradeDom();

    this.props.checkStatus();

    if (this.props.isUploading) {
      FileUploadingStore.uploadFiles(function (error) {
        if (error) {
          console.error(error);
          UploadActionCreators.notifyUploadFailed();
        }
      });
    }
  },

  componentDidUpdate() {
    if (this.props.progress.collectionId && !this.notificationChannel) {
      this.notificationChannel = subscribe(
        this.props.progress.collectionId,
        'upload-progress',
        data => this.props.updateProgress(data)
      );
    }
  },

  render() {
    return (
      <div className="wgsa-upload-progress">
        <main className="wgsa-upload-progress-container">
          <div className="wgsa-collection-url-display wgsa-card mdl-shadow--2dp">
            <div className="mdl-card__supporting-text">
              Final results will be available at the above address. <br/>
              If upload fails to progress, please refresh at a later time.
            </div>
          </div>
          <Dashboard {...this.props.progress}
            isUploading={this.props.isUploading}
          />
        </main>
      </div>
    );
  },

});

export default connect()(UploadProgress);
