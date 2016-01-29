import React from 'react';

import FileUploadingProgress from './FileUploadingProgress.react';
import UploadButton from './navigation/UploadButton.react';

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

export default React.createClass({

  displayName: 'UploadReviewHeader',

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
    return (
        <header style={headerStyle} className="mdl-layout__header">
          <div className="mdl-layout-icon"></div>
          <div style={headerStyle} className="mdl-layout__header-row">
            <span style={headerStyle} className="mdl-layout-title">WGSA | {Species.formattedName}</span>
            <span className="mdl-layout-spacer" />
            <span style={subtitleStyle} className="mdl-layout-title">{this.props.subtitle}</span>
            <UploadButton activateButton={this.props.activateUploadButton} uploadProgressPercentage={this.state.uploadProgressPercentage} isUploading={this.props.isUploading} />
          </div>
          <FileUploadingProgress />
        </header>
    );
  },

  handleFileUploadingProgressStoreChange() {
    const percentage = FileUploadingProgressStore.getProgressPercentage();
    this.setState({
      uploadProgressPercentage: percentage,
    });
  },

});
