import '../../css/upload-review.css';
import '../../css/forms.css';

import React from 'react';

import FileDragAndDrop from './DragAndDrop.react';

import AssemblyMetadata from './AssemblyMetadata.react';
import AssemblyAnalysis from './AssemblyAnalysis.react';
import AssemblyAnalysisChart from './AssemblyAnalysisChart.react';

import UploadWorkspaceNavigation from './UploadWorkspaceNavigation.react';
import UploadReviewHeader from './UploadReviewHeader.react';
import Overview from './Overview.react';
import UploadingFilesDetailed from './UploadingFilesDetailed.react';

import UploadActionCreators from '^/actions/UploadActionCreators';
import UploadStore from '^/stores/UploadStore';
import SocketActionCreators from '^/actions/SocketActionCreators';
import UploadWorkspaceNavigationActionCreators from '^/actions/UploadWorkspaceNavigationActionCreators';
import ToastActionCreators from '^/actions/ToastActionCreators';

import UploadWorkspaceNavigationStore from '^/stores/UploadWorkspaceNavigationStore';
import FileProcessingStore from '^/stores/FileProcessingStore';
import FileUploadingStore from '^/stores/FileUploadingStore';
import FileUploadingProgressStore from '^/stores/FileUploadingProgressStore';
import SocketStore from '^/stores/SocketStore';

import SocketUtils from '^/utils/Socket';
import Species from '^/species';
import DEFAULT from '^/defaults';

const loadingAnimationStyleVisible = {
  visibility: 'visible',
};

const loadingAnimationStyleHidden = {
  visibility: 'hidden',
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

let isProcessing = false;

export default React.createClass({

  contextTypes: {
    history: React.PropTypes.object,
  },

  getInitialState() {
    return {
      readyToUpload: false,
      confirmedMultipleMetadataDrop: false,
      pageTitleMessage: 'Upload',
      isUploading: FileUploadingStore.getFileUploadingState(),
      numberOfAssemblies: UploadStore.getAssembliesCount(),
      viewPage: 'overview',
      assemblyName: null,
      uploadProgressPercentage: 0,
      collectionUrl: null,
    };
  },

  componentDidMount() {
    FileProcessingStore.addChangeListener(this.handleFileProcessingStoreChange);
    FileUploadingStore.addChangeListener(this.handleFileUploadingStoreChange);
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);
    UploadWorkspaceNavigationStore.addChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
    UploadStore.addChangeListener(this.handleUploadStoreChange);

    const socket = SocketUtils.socketConnect();

    socket.on('connect', function () {
      console.log('[WGSA] Socket connected');
    });

    socket.on('disconnect', function () {
      console.error('[WGSA] Socket connection lost');
    });

    SocketStore.addChangeListener(this.handleSocketStoreChange);
    SocketActionCreators.setSocketConnection(socket);
  },

  componentWillUnmount() {
    FileProcessingStore.removeChangeListener(this.handleFileProcessingStoreChange);
    FileUploadingStore.removeChangeListener(this.handleFileUploadingStoreChange);
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
    SocketStore.removeChangeListener(this.handleSocketStoreChange);
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
    UploadStore.removeChangeListener(this.handleUploadStoreChange);
  },

  handleSocketStoreChange() {
    if (!SocketStore.getRoomId()) {
      SocketStore.getSocketConnection().on('roomId', function iife(roomId) {
        SocketActionCreators.setRoomId(roomId);
      });

      SocketStore.getSocketConnection().emit('getRoomId');
    }
  },

  handleFileProcessingStoreChange() {
    isProcessing = FileProcessingStore.getFileProcessingState();
    this.setState({
      pageTitleMessage: isProcessing ? 'Processing...' : 'Overview',
    });
  },

  handleFileUploadingStoreChange() {
    let uploadingResult = FileUploadingStore.getFileUploadingResult();
    const id = FileUploadingStore.getCollectionId();
    const path = `/${Species.nickname}/collection/${id}`;
    const { history } = this.context;
    if (uploadingResult === FileUploadingStore.getFileUploadingResults().SUCCESS) {
      history.pushState(null, path);
      UploadStore.clearStore();
      FileUploadingStore.clearStore();
      FileUploadingProgressStore.clearStore();
      return;
    }

    this.setState({
      isUploading: FileUploadingStore.getFileUploadingState(),
      viewPage: 'upload_progress',
      collectionUrl: id ? window.location.origin + path : null,
    });
  },

  handleUploadWorkspaceNavigationStoreChange() {
    this.setState({
      viewPage: UploadWorkspaceNavigationStore.getCurrentViewPage(),
      assemblyName: UploadWorkspaceNavigationStore.getAssemblyName(),
    });
  },

  confirmDuplicateOverwrite(files) {
    this.setState({
      confirmedMultipleMetadataDrop: true,
    });
    UploadActionCreators.addFiles(files);
  },

  handleDrop(event) {
    if (event.files.length > 0 && !this.state.isUploading) {
      if (!this.state.confirmedMultipleMetadataDrop && this.state.numberOfAssemblies > 0) {
        ToastActionCreators.showToast({
          message: 'Duplicate records will be overwritten.',
          action: {
            label: 'confirm',
            onClick: this.confirmDuplicateOverwrite.bind(this, Array.from(event.files)),
          },
          sticky: true,
        });
      } else {
        UploadActionCreators.addFiles(event.files);
      }
      // allows the same file to be uploaded consecutively
      this.refs.fileInput.value = '';
    }
  },

  handleClick() {
    if (this.state.isUploading) {
      UploadWorkspaceNavigationActionCreators.setViewPage('upload_progress');
    } else {
      this.refs.fileInput.click();
    }
  },

  handleOverviewClick() {
    UploadWorkspaceNavigationActionCreators.setViewPage('overview');
  },

  handleFileInputChange(event) {
    this.handleDrop(event.target);
  },

  handleUploadStoreChange() {
    this.setState({
      readyToUpload: UploadStore.isReadyToUpload(),
      numberOfAssemblies: UploadStore.getAssembliesCount(),
    });
  },

  handleFileUploadingProgressStoreChange() {
    const percentage = FileUploadingProgressStore.getProgressPercentage();
    this.setState({
      uploadProgressPercentage: percentage,
    });
  },

  render() {
    let pageTitle = 'WGSA';
    let species = Species.formattedName;
    let activeAssemblyName = '';

    const assembly = UploadStore.getAssembly(this.state.assemblyName);

    switch (this.state.viewPage) {
    case 'assembly':
      activeAssemblyName = assembly && assembly.fasta.name;
      break;
    case 'upload_progress':
      activeAssemblyName = 'Uploading...';
      break;
    default: activeAssemblyName = this.state.pageTitleMessage;
    }

    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer">
          <UploadReviewHeader title={pageTitle} species={species} activeAssemblyName={activeAssemblyName} activateUploadButton={this.state.readyToUpload} uploadProgressPercentage={this.state.uploadProgressPercentage} isUploading={this.state.isUploading} />

          <UploadWorkspaceNavigation assembliesUploaded={assembly ? true : false} totalAssemblies={this.state.numberOfAssemblies}>
            <footer className="wgsa-upload-navigation__footer mdl-shadow--4dp">
              <button type="button" title="Overview"
                className="wgsa-upload-review-button mdl-button mdl-js-button mdl-button--raised mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect"
                onClick={this.handleOverviewClick}>
                <i className="material-icons">home</i>
              </button>

              { !this.state.isUploading &&
                <button type="button" title="Add files"
                  className="wgsa-upload-review-button mdl-button mdl-js-button mdl-button--raised mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect"
                  onClick={this.handleClick}>
                  <i className="material-icons">add</i>
                </button>
              }
            </footer>
          </UploadWorkspaceNavigation>

          <main className="mdl-layout__content" style={layoutContentStyle}>
            <div id="loadingAnimation" style={isProcessing ? loadingAnimationStyleVisible : loadingAnimationStyleHidden} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>

            {
              (() => {
                switch (this.state.viewPage) {
                case 'assembly':
                  return (
                    <div className="mdl-grid">
                      <div className="mdl-cell mdl-cell--6-col wgsa-card-column">
                        <div className="wgsa-card mdl-shadow--4dp">
                          <div className="wgsa-card-heading">Assembly Statistics</div>
                          <div className="wgsa-card-content">
                            <AssemblyAnalysis assembly={assembly}/>
                          </div>
                        </div>
                      </div>
                      <div className="mdl-cell mdl-cell--6-col wgsa-card-column chart-card">
                        <div className="wgsa-card mdl-shadow--4dp">
                          <div className="wgsa-card-heading">N50 Chart</div>
                          <div className="wgsa-card-content ">
                            <AssemblyAnalysisChart metrics={assembly && assembly.metrics} />
                          </div>
                        </div>
                      </div>
                      <div className="wgsa-card mdl-cell mdl-cell--12-col increase-cell-gutter mdl-shadow--4dp">
                        <div className="wgsa-card-heading">Metadata</div>
                        <div className="wgsa-card-content">
                          <AssemblyMetadata assembly={assembly} isUploading={this.state.isUploading}/>
                        </div>
                      </div>
                    </div>
                  );
                case 'overview':
                  return (
                   <Overview clickHandler={this.handleClick} uploadProgressPercentage={this.state.uploadProgressPercentage} isUploading={this.state.isUploading} isReadyToUpload={this.state.readyToUpload} />
                  );
                case 'upload_progress':
                  return (
                    <div>
                      <UploadingFilesDetailed collectionUrl={this.state.collectionUrl}/>
                    </div>
                  );
                default:
                  // should never hit default
                }
              })() }
          </main>
          <input type="file" multiple="multiple" accept={DEFAULT.SUPPORTED_FILE_EXTENSIONS} ref="fileInput" style={fileInputStyle} onChange={this.handleFileInputChange} />
        </div>
      </FileDragAndDrop>
    );
  },
});
