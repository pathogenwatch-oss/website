import React from 'react';

import FileUploadingProgress from './FileUploadingProgress.react';
import UploadingAssembliesProgress from './UploadingAssembliesProgress.react';

const layoutStyle = {
  alignItems: 'center',
  justifyContent: 'center',
};

const contentStyle = {
  maxWidth: '960px',
  textAlign: 'center',
  flexGrow: 0,
};

const headerStyle = {
  fontWeight: '300',
  fontSize: '20px',
  textShadow: '1px 1px #fff',
};

const featureStyle = {
  fontWeight: 'bold',
};

const UploadingFiles = React.createClass({

  componentDidMount() {
    componentHandler.upgradeElement(React.findDOMNode(this.refs.spinner));
  },

  render() {
    return (
      <div className="mdl-layout mdl-js-layout" style={layoutStyle}>
        <main className="mdl-layout__content" style={contentStyle}>
          <div ref="spinner" className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
          <h2 style={headerStyle}><span style={featureStyle}>Uploading</span> and <span style={featureStyle}>analysing</span> your files.</h2>
          <FileUploadingProgress />
          <UploadingAssembliesProgress />
        </main>
      </div>
    );
  },

});

module.exports = UploadingFiles;
