import '../../css/upload-review.css';
import '../../css/forms.css';

import React from 'react';
import FileDragAndDrop from 'react-file-drag-and-drop';

import AssemblyMetadata from './AssemblyMetadata.react';
import AssemblyAnalysis from './AssemblyAnalysis.react';

import AssemblyAnalysisChart from './AssemblyAnalysisChart.react';

import UploadWorkspaceNavigation from './UploadWorkspaceNavigation.react';
import UploadReviewHeader from './UploadReviewHeader.react';
import Overview from './Overview.react';
import UploadingFilesDetailed from './UploadingFilesDetailed.react';

import UploadActionCreators from '../../actions/UploadActionCreators';
import UploadStore from '../../stores/UploadStore';
import SocketActionCreators from '../../actions/SocketActionCreators';
import UploadWorkspaceNavigationActionCreators from '../../actions/UploadWorkspaceNavigationActionCreators';
import UploadWorkspaceNavigationStore from '../../stores/UploadWorkspaceNavigationStore';
import FileProcessingStore from '../../stores/FileProcessingStore';
import FileUploadingStore from '../../stores/FileUploadingStore';
import SocketStore from '../../stores/SocketStore';

import SocketUtils from '../../utils/Socket';
import Species from '../../species';
import DEFAULT from '../../defaults';
import { validateMetadata } from '../../utils/Metadata';

const loadingAnimationStyle = {
  visibility: 'visible'
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

var isProcessing = false;

const AssemblyWorkspace = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object,
    totalAssemblies: React.PropTypes.number,
  },

  contextTypes: {
    router: React.PropTypes.func,
  },

  getInitialState() {
    return {
      uploadButtonActive: false,
      confirmedMultipleMetadataDrop: false,
      pageTitleAppend: 'Upload',
      isUploading: FileUploadingStore.getFileUploadingState(),
      viewPage: 'overview',
    };
  },

  componentDidMount() {
    FileProcessingStore.addChangeListener(this.handleFileProcessingStoreChange);
    FileUploadingStore.addChangeListener(this.handleFileUploadingStoreChange);
    UploadWorkspaceNavigationStore.addChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
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
    FileUploadingStore.removeChangeListener(this.handleFileUploadingStoreChange);
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
    isProcessing = FileProcessingStore.getFileProcessingState();
    if (isProcessing) {
      this.setState({
        pageTitleAppend: 'Processing...'
      });
    }
    else {
      this.setState({
        pageTitleAppend: 'Overview'
      });
    }
  },

  handleFileUploadingStoreChange() {
    const uploadingResult = FileUploadingStore.getFileUploadingResult();
    console.log('result', uploadingResult);
    if (uploadingResult === FileUploadingStore.getFileUploadingResults().SUCCESS) {
      const id = FileUploadingStore.getCollectionId();
      const { transitionTo, makePath } = this.context.router;
      transitionTo(makePath('collection', { species: Species.nickname, id }));
      return;
    }

    this.setState({
      isUploading: FileUploadingStore.getFileUploadingState(),
      viewPage: 'upload_progress'
    });
  },

  handleUploadWorkspaceNavigationStoreChange() {
    this.setState({
      viewPage: UploadWorkspaceNavigationStore.getCurrentViewPage()
    });
  },

  handleDrop(event) {
    if (event.files.length > 0 && !this.state.isUploading) {
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
    }
  },

  handleClick() {
    if (this.state.isUploading) {
      UploadWorkspaceNavigationActionCreators.setViewPage('upload_progress');
    }
    else {
      React.findDOMNode(this.refs.fileInput).click();
    }

  },

  handleOverviewClick() {
    // UploadWorkspaceNavigationActionCreators.navigateToAssembly(null);
    UploadWorkspaceNavigationActionCreators.setViewPage('overview');
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
    let pageTitle = 'WGSA';
    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer">
          <UploadReviewHeader title={pageTitle} isProcessing={isProcessing} activateUploadButton={this.state.uploadButtonActive} isUploading={this.state.isUploading} />

          <UploadWorkspaceNavigation assembliesUploaded={this.props.assembly ? true : false} totalAssemblies={this.props.totalAssemblies}>
            <footer className="wgsa-upload-navigation__footer mdl-shadow--4dp">
              <button type="button" title="Overview" className="mdl-button mdl-js-button mdl-button--raised mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect"
                onClick={this.handleOverviewClick}>
                <i className="material-icons">home</i>
              </button>

              { !this.state.isUploading &&
                <button ref="spinner_button" type="button" className="uploadprogress-spinner-button mdl-button mdl-js-button mdl-button--raised mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect"
                  onClick={this.handleClick}>
                  <i className="material-icons">add</i>
                </button>
              }
            </footer>
          </UploadWorkspaceNavigation>

          <main className="mdl-layout__content" style={layoutContentStyle}>
            {
              (() => {
                switch (this.state.viewPage) {
                  case "assembly":  return (
                    <div className="assemblyWorkspaceContainer mdl-grid assemblyWorkspaceContent">
                      <div className="overflow-y--auto mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                        <div className="heading"> Metadata </div>
                        <div className="card-style">
                          <AssemblyMetadata key={this.props.assembly.metadata.assemblyName} assembly={this.props.assembly} />
                        </div>
                      </div>

                      <div className="overflow-y--auto mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                        <div className="mdl-grid mdl-grid--no-spacing">
                          <div className="mdl-cell mdl-cell--12-col">
                            <div className="heading"> Assembly Statistics </div>
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
                  );
                  case "overview":  return (
                   <Overview clickHandler={this.handleClick} />
                  );
                  case "upload_progress": return (
                    <div>
                      <UploadingFilesDetailed />
                    </div>
                  );
                  default: return (
                    <Overview clickHandler={this.handleClick} />
                  );
                }
              }) ()}
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

      </div>
    );
  },

  handleClick() {
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(null);
  },

});
module.exports = AssemblyWorkspace;
