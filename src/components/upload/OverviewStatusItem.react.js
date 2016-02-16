import React from 'react';

import FileUploadingProgressStore from '^/stores/FileUploadingProgressStore';

import DEFAULT from '^/defaults';

export default React.createClass({

  displayName: 'OverviewStatusItem',

  propTypes: {
    isReadyToUpload: React.PropTypes.bool,
    isUploading: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      uploadProgressPercentage: 0,
    };
  },

  componentDidMount() {
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  componentWillUnmount() {
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  render() {
    const iconStyle = {
      color: this.props.isReadyToUpload ? DEFAULT.CGPS.COLOURS.GREEN : DEFAULT.DANGER_COLOUR,
    };
    return (
      <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--6-col">
        { this.props.isUploading &&
            <div style={iconStyle} className="mdl-card__title mdl-card--expand">
              {this.state.uploadProgressPercentage + '%'}
            </div>
          ||
            <div className="mdl-card__title mdl-card--expand">
              <i style={iconStyle} className="material-icons">{this.props.isReadyToUpload && 'check_circle' || 'error'}</i>
            </div>
        }
        <span className="mdl-card__actions mdl-card--border">
          { this.props.isUploading ? 'Upload Progress' :
              (this.props.isReadyToUpload &&  'Ready To Upload' || 'Not Ready To Upload')
          }
        </span>
      </div>
    );
  },

  handleFileUploadingProgressStoreChange() {
    const percentage = FileUploadingProgressStore.getProgressPercentage();
    this.setState({
      uploadProgressPercentage: percentage,
    });
  },

});
