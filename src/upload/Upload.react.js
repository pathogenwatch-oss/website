import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../drag-and-drop';
import Instructions from './Instructions.react';
import Progress from './Progress.react';

import { getUploadedGenomeList } from './selectors';

import { addFiles } from './actions';

import { subscribe, unsubscribe } from '../utils/Notification';

import config from '../app/config';

const Component = React.createClass({

  propTypes: {
    hasGenomes: React.PropTypes.bool,
    uploads: React.PropTypes.object,
    addFiles: React.PropTypes.func.isRequired,
    isUploading: React.PropTypes.bool,
    waiting: React.PropTypes.bool,
    prefilter: React.PropTypes.string,
    fetch: React.PropTypes.func,
  },

  contextTypes: {
    router: React.PropTypes.object,
  },

  componentWillMount() {
    subscribe(config.clientId, 'analysis', console.log);
  },

  componentWillUnmount() {
    unsubscribe(config.clientId);
  },

  upload(newFiles) {
    this.props.addFiles(newFiles);
  },

  renderContent() {
    const { files } = this.props;

    if (files.length === 0) {
      return <Instructions />;
    }

    return <Progress />;
  },

  render() {
    return (
      <FileDragAndDrop onFiles={this.upload}>
        <div className="wgsa-hipster-style wgsa-filterable-view">
          {this.renderContent()}
        </div>
      </FileDragAndDrop>
    );
  },

});

function mapStateToProps(state) {
  return {
    files: getUploadedGenomeList(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addFiles: files => dispatch(addFiles(files)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
