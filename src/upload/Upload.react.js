import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../drag-and-drop';
import Instructions from './Instructions.react';
import Progress from './Progress.react';
import { Summary } from '../filter/summary';

import { getUploadedGenomeList } from './selectors';

import { addFiles, receiveUploadAnalysis } from './actions';

import { subscribe, unsubscribe } from '../utils/Notification';

import config from '../app/config';

const Component = React.createClass({

  componentWillMount() {
    subscribe(config.clientId, 'analysis', this.props.receiveAnalysis);
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
          <Summary />
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
    receiveAnalysis: msg => dispatch(receiveUploadAnalysis(msg)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
