import '../../css/upload-review.css';
import '../../css/forms.css';

import React from 'react';
import FileDragAndDrop from 'react-file-drag-and-drop';

import AssemblyMetadata from './AssemblyMetadata.react';
import AssemblyAnalysis from './AssemblyAnalysis.react';

import AssemblyAnalysisChart from './AssemblyAnalysisChart.react';

import UploadWorkspaceNavigation from './UploadWorkspaceNavigation.react';
import UploadReviewHeader from './UploadReviewHeader.react.js';
import UploadStore from '../../stores/UploadStore.js';
import Overview from './Overview.react';

import UploadActionCreators from '../../actions/UploadActionCreators';
import SocketActionCreators from '../../actions/SocketActionCreators';
import UploadWorkspaceNavigationActionCreators from '../../actions/UploadWorkspaceNavigationActionCreators';
import FileProcessingStore from '../../stores/FileProcessingStore';
import SocketStore from '../../stores/SocketStore';

import SocketUtils from '../../utils/Socket';
import DEFAULT from '../../defaults.js';
import { validateMetadata } from '../../utils/Metadata.js';

const loadingAnimationStyle = {
  display: 'block',
};

const layoutContentStyle = {
  background: DEFAULT.CGPS.COLOURS.GREY_LIGHT,
  position: 'relative',
};

const fileInputStyle = {
  position: 'absolute',
  zIndex: -1,
  opacity: 0,
};

const AssemblyWorkspace = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object,
    totalAssemblies: React.PropTypes.number,
  },

  getInitialState() {
    return {
      isProcessing: false,
      uploadButtonActive: false,
      confirmedMultipleMetadataDrop: false,
      pageTitleAppend: 'Upload'
    };
  },

  componentDidMount() {
    FileProcessingStore.addChangeListener(this.handleFileProcessingStoreChange);
    UploadStore.addChangeListener(this.activateUploadButton);

    const socket = SocketUtils.socketConnect();

    socket.on('connect', function iife() {
      console.log('[Macroreact] Socket connected');
    });

    SocketStore.addChangeListener(this.handleSocketStoreChange);
    SocketActionCreators.setSocketConnection(socket);
  },

  componentWillUnmount() {
    FileProcessingStore.removeChangeListener(this.handleFileProcessingStoreChange);
    SocketStore.removeChangeListener(this.handleSocketStoreChange);
  },

  handleSocketStoreChange() {
    if (!SocketStore.getRoomId()) {
      SocketStore.getSocketConnection().on('roomId', function iife(roomId) {
        // console.log('[Macroreact] Got socket room id ' + roomId);
        SocketActionCreators.setRoomId(roomId);
      });

      SocketStore.getSocketConnection().emit('getRoomId');
    }
  },

  handleFileProcessingStoreChange() {
    this.setState({
      isProcessing: FileProcessingStore.getFileProcessingState(),
    });
  },

  handleDrop(event) {
    if (event.files.length > 0) {
      if (!this.state.confirmedMultipleMetadataDrop && this.props.totalAssemblies > 0) {
        var multipleDropConfirm = confirm('Duplicate records will be overwritten');
        if (multipleDropConfirm) {
          this.setState({
            confirmedMultipleMetadataDrop: true,
          });
          UploadActionCreators.addFiles(event.files);
        }
      } else {
        UploadActionCreators.addFiles(event.files);
      }
      this.setState({
        pageTitleAppend: 'Overview'
      })
    }
  },

  handleClick() {
    React.findDOMNode(this.refs.fileInput).click();
  },

  handleFileInputChange(event) {
    this.handleDrop(event.target);
  },

  activateUploadButton() {
    const assemblies = UploadStore.getAssemblies();
    const isValidMap = validateMetadata(assemblies);
    let isValid = true;

    if (!Object.keys(isValidMap)) {
      isValid = false;
    }

    for (const id in isValidMap) {
      if (!isValidMap[id]) {
        isValid = false;
        break;
      }
    }

    this.setState({
      uploadButtonActive: isValid,
    });
  },

  render() {
    loadingAnimationStyle.display = this.state.isProcessing ? 'block' : 'none';
    let pageTitle = 'WGSA';

    if (this.props.assembly) {
      pageTitle = `WGSA | ${this.props.assembly.fasta.name}`;
    } else {
      pageTitle = `WGSA | ${this.state.pageTitleAppend}`;
    }

    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <div className="assemblyWorkspaceContainer mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer">
          <UploadReviewHeader title={pageTitle} activateUploadButton={this.state.uploadButtonActive} />
          <div id="loadingAnimation" style={loadingAnimationStyle} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>

          <UploadWorkspaceNavigation assembliesUploaded={this.props.assembly ? true : false} totalAssemblies={this.props.totalAssemblies}>
            <footer className="wgsa-upload-navigation__footer mdl-shadow--4dp">
              <AssemblyOverviewButton enabled={this.props.assembliesUploaded}/>
              <button type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect" onClick={this.handleClick}>
                <i className="material-icons">add</i>
              </button>
            </footer>
          </UploadWorkspaceNavigation>

          <main className="mdl-layout__content" style={layoutContentStyle}>
            { this.props.assembly &&
              <div>
                <div className="mdl-grid">
                  <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                    <div className="heading"> Metadata </div>
                    <div className="card-style">
                      <AssemblyMetadata key={this.props.assembly.metadata.assemblyName} assembly={this.props.assembly} />
                    </div>
                  </div>

                  <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                    <div className="mdl-grid mdl-grid--no-spacing">
                      <div className="mdl-cell mdl-cell--12-col">
                        <div className="heading"> Assembly Metrics </div>
                        <div className="card-style">
                          <AssemblyAnalysis assembly={this.props.assembly} />
                        </div>
                      </div>
                      <div className="mdl-cell mdl-cell--12-col">
                        <div className="heading"> N50 Chart </div>
                        <div className="card-style">
                          <AssemblyAnalysisChart analysis={this.props.assembly.analysis} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              ||

              <Overview clickHandler={this.handleClick} />

            }
          </main>
        </div>
        <input type="file" multiple="multiple" accept={DEFAULT.SUPPORTED_FILE_EXTENSIONS} ref="fileInput" style={fileInputStyle} onChange={this.handleFileInputChange} />
      </FileDragAndDrop>
    );
  },

});

const AssemblyOverviewButton = React.createClass({

  render() {
    return (
      <div className="overview-button">
        <button type="button" title="Overview" className="mdl-button mdl-js-button mdl-button--raised mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect" onClick={this.handleClick}>
          <i className="material-icons">home</i>
        </button>
      </div>
    );
  },

  handleClick() {
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(null);
  },

});
module.exports = AssemblyWorkspace;
